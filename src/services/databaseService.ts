import https from "https";
import logger from "../utils/logger";
import readLocalData from "../utils/local";
import DatabaseModel from "../models/databaseModel";
import LotteryModel from "../models/lotteryModel";

interface RemoteData {
  drawPdfUrl: string;
  lotteryDrawNum: string;
  lotteryDrawResult: string;
  lotteryDrawTime: string;
  totalSaleAmount: string;
  prizeLevelList: Lottery.PrizeRecord[];
}

interface RemoteP5Data extends RemoteData {
  poolBalanceAfterdraw: string;
}

interface RemoteLotteryData extends RemoteData {
  lotteryUnsortDrawresult: string;
  poolBalanceAfterdraw: string;
}

type FetchRequestFn<T> = (page: number) => Promise<T>;

// 获取远端数据
class FetchRemoteService {
  private async pullOnePageData<R>(url: string) {
    return new Promise<R>((resolve, reject) => {
      https
        .get(url, function (res) {
          let words = "";
          res.on("data", function (data) {
            words += data;
          });
          res.on("end", function () {
            const data = JSON.parse(words).value;
            resolve(data);
          });
        })
        .on("error", function (error) {
          reject(null);
        });
    });
  }

  private checkPageType(page: number) {
    if (typeof page !== "number")
      throw Error("Expect page to be of type number.");
  }

  private requestUrl(game: string, page: number) {
    this.checkPageType(page);
    return `https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=${game}&provinceId=0&pageSize=100&isVerify=1&pageNo=${page}`;
  }
  fetchP3: FetchRequestFn<RemoteData> = async (page: number) => {
    this.checkPageType(page);
    return await this.pullOnePageData<RemoteData>(this.requestUrl("35", page));
  };

  fetchP5: FetchRequestFn<RemoteP5Data> = async (page: number) => {
    this.checkPageType(page);
    return await this.pullOnePageData<RemoteP5Data>(
      this.requestUrl("350133", page)
    );
  };

  fetchLottery: FetchRequestFn<RemoteLotteryData> = async (page: number) => {
    this.checkPageType(page);
    return await this.pullOnePageData<RemoteLotteryData>(
      this.requestUrl("85", page)
    );
  };
}

class FeatureService extends FetchRemoteService {
  constructor() {
    super();
  }

  private delay() {
    return new Promise((resolve) => {
      const timeout = Math.ceil((Math.random() + 0.5) * 10 * 1000);
      setTimeout(() => {
        resolve(true);
      }, timeout);
    });
  }

  /**
   * 根据给定的请求获取数据，并且可指定结束页
   * @param request 请求函数
   * @param end 结束页
   * @returns Promise<result>
   */
  async requestData<
    T extends (...args: any[]) => any,
    R = Awaited<ReturnType<T>>
  >(request: T, end?: number): Promise<R[]> {
    if (typeof request !== "function")
      throw Error("The request parameter is expected to be a function.");

    const delay = this.delay;

    async function getData(page: number, result: R[]) {
      logger.info(`Current Page : ${page}`);

      return new Promise<R[]>(async (resolve, reject) => {
        try {
          const { pages, pageNo, list } = await request(page);

          // handle data then append.
          result.push(...list);

          // end page number
          const EndPageNo = typeof end === "number" && end >= 1 ? end : pages;

          // pull completed.
          if (pageNo === EndPageNo) resolve(result);
          else {
            // waiting
            await delay();

            // pull next page data.
            getData(pageNo + 1, result)
              .then(resolve)
              .catch(reject);
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    return await getData(1, []);
  }
}

class DataService extends FeatureService {
  constructor() {
    super();
  }

  /**
   * 返回排列三需要存储的数据
   * @param {*} data 远端数据
   * @returns
   */
  private returnPartialP3Data(
    data: Omit<RemoteData, "prizeLevelList">
  ): Lottery.LotteryCommonData {
    try {
      const {
        drawPdfUrl,
        lotteryDrawNum,
        lotteryDrawResult,
        lotteryDrawTime,
        totalSaleAmount,
      } = data;

      return {
        pdf: drawPdfUrl,
        num: lotteryDrawNum,
        result: lotteryDrawResult,
        time: lotteryDrawTime,
        sale: totalSaleAmount,
      };
    } catch (error) {
      return {
        pdf: "",
        num: "",
        result: "",
        time: "",
        sale: "",
      };
    }
  }

  /**
   * 获取排列三所有数据
   */
  async getP3FullData(): Promise<{
    list: Lottery.LotteryCommonData[];
    prize: Lottery.PrizeData;
  }> {
    try {
      const data = await this.requestData(this.fetchP3);
      const prize: Lottery.PrizeData = {};
      const list = data.map(({ prizeLevelList, ...rest }: RemoteData) => {
        prize[rest.lotteryDrawNum] = prizeLevelList;
        return this.returnPartialP3Data(rest);
      });
      return { list, prize };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取排列三最新数据
   */
  async getP3LatestData(
    localData: Lottery.LotteryCommonData[] | null,
    localPrizeData: Lottery.PrizeData | null
  ): Promise<
    | {
        list: Lottery.LotteryCommonData[];
        prize: Lottery.PrizeData;
      }
    | false
  > {
    try {
      const recentData = await this.requestData(this.fetchP3, 1);

      // update count.
      const latest = [];
      for (let i = 0; i < recentData.length; i++) {
        const { prizeLevelList, ...rest } = recentData[i];
        if (
          !localData?.some(
            (item: Lottery.LotteryCommonData) =>
              item?.time === rest.lotteryDrawTime
          ) &&
          localPrizeData
        ) {
          latest.push(this.returnPartialP3Data(rest));
          const key = rest.lotteryDrawNum as string;
          localPrizeData[key] = prizeLevelList;
        } else break;
      }

      // log length
      const LatestLength = latest.length;
      logger.info(`Total ${LatestLength} P3 data has been updated.`);

      // write data
      if (LatestLength > 0 && localData) {
        localData.unshift(...latest);
        return { list: localData, prize: localPrizeData as Lottery.PrizeData };
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 返回排列五需要存储的数据
   * @param {*} data
   * @returns
   */
  private returnPartialP5Data(data: RemoteP5Data): Lottery.LotteryP5Data {
    try {
      const {
        drawPdfUrl,
        lotteryDrawNum,
        lotteryDrawResult,
        lotteryDrawTime,
        poolBalanceAfterdraw,
        prizeLevelList,
        totalSaleAmount,
      } = data;

      const prize = Array.isArray(prizeLevelList) ? prizeLevelList[0] : null;
      return {
        stakeCount: prize ? prize.stakeCount : "0",
        pdf: drawPdfUrl,
        num: lotteryDrawNum,
        result: lotteryDrawResult,
        time: lotteryDrawTime,
        sale: totalSaleAmount,
        pool: poolBalanceAfterdraw,
      };
    } catch (error) {
      return {
        stakeCount: "",
        pdf: "",
        num: "",
        result: "",
        time: "",
        sale: "",
        pool: "",
      };
    }
  }

  /**
   * 获取排列五所有数据
   */
  async getP5FullData(): Promise<Lottery.LotteryP5Data[]> {
    try {
      const data = await this.requestData(this.fetchP5);
      const list = data.map((item) => this.returnPartialP5Data(item));
      return list;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取排列五最新数据
   */
  async getP5LatestData(localData: Lottery.LotteryP5Data[] | null) {
    try {
      const recentData = await this.requestData(this.fetchP5, 1);

      // update count.
      const latest = [];
      for (let i = 0; i < recentData.length; i++) {
        const curr = recentData[i];
        if (!localData?.some((item) => item.time === curr.lotteryDrawTime)) {
          latest.push(this.returnPartialP5Data(curr));
        } else break;
      }

      // log length
      const LatestLength = latest.length;
      logger.info(`Total ${LatestLength} P5 data has been updated.`);

      // write data
      if (LatestLength > 0 && localData) {
        localData.unshift(...latest);
        return localData;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 返回大乐透需要存储的数据
   * @param {*} data
   * @returns
   */
  private returnPartialLotteryData(
    data: RemoteLotteryData
  ): Lottery.LotteryData {
    try {
      const {
        lotteryDrawNum,
        lotteryDrawResult,
        lotteryDrawTime,
        lotteryUnsortDrawresult,
        poolBalanceAfterdraw,
        totalSaleAmount,
        drawPdfUrl,
      } = data;

      return {
        pdf: drawPdfUrl,
        num: lotteryDrawNum,
        result: lotteryDrawResult,
        time: lotteryDrawTime,
        sale: totalSaleAmount,
        pool: poolBalanceAfterdraw,
        order: lotteryUnsortDrawresult,
      };
    } catch (error) {
      return {
        pdf: "",
        num: "",
        result: "",
        time: "",
        sale: "",
        pool: "",
        order: "",
      };
    }
  }

  /**
   * 获取大乐透所有数据
   */
  async getLotteryFullData(): Promise<Lottery.LotteryData[]> {
    try {
      const data = await this.requestData(this.fetchLottery);
      const list = data.map((item) => this.returnPartialLotteryData(item));
      return list;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取大乐透最新数据
   */
  async getLotteryLatestData(
    localData: Lottery.LotteryData[] | null
  ): Promise<Lottery.LotteryData[] | false> {
    try {
      const recentData = await this.requestData(this.fetchLottery, 1);

      // update count.
      const latest = [];
      for (let i = 0; i < recentData.length; i++) {
        const curr = recentData[i];
        if (!localData?.some((item) => item.time === curr.lotteryDrawTime)) {
          latest.push(this.returnPartialLotteryData(curr));
        } else break;
      }

      // log length
      const LatestLength = latest.length;
      logger.info(`Total ${LatestLength} Lottery data has been updated.`);

      // write data
      if (LatestLength > 0 && localData) {
        localData.unshift(...latest);
        return localData;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

class DatabaseService extends DataService {
  constructor() {
    super();
  }

  async fetch(type: string): Promise<boolean> {
    switch (type) {
      case "p3":
        const p3Data = await this.getP3FullData();
        if (p3Data) await DatabaseModel.writeP3Data(p3Data.list, p3Data.prize);
        break;
      case "p5":
        const p5Data = await this.getP5FullData();
        if (p5Data) await DatabaseModel.writeP5Data(p5Data);
        break;
      case "lottery":
        const lotteryData = await this.getLotteryFullData();
        if (lotteryData) await DatabaseModel.writeLotteryData(lotteryData);
        break;
      default:
        break;
    }
    return true;
  }

  async sync(type: Lottery.LotteryType): Promise<boolean> {
    const p3LocalData = await LotteryModel.findP3JSONData();
    const p3LocalPrizeData = await LotteryModel.findP3PrizeData();
    const p5LocalData = await LotteryModel.findP5JSONData();
    const lotteryLocalData = await LotteryModel.findLotteryJSONData();

    // 更新所有数据
    if (type === undefined) {
      const p3Data = await this.getP3LatestData(p3LocalData, p3LocalPrizeData);
      if (p3Data) await DatabaseModel.writeP3Data(p3Data.list, p3Data.prize);

      const p5Data = await this.getP5LatestData(p5LocalData);
      if (p5Data) await DatabaseModel.writeP5Data(p5Data);

      const lotteryData = await this.getLotteryLatestData(lotteryLocalData);
      if (lotteryData) await DatabaseModel.writeLotteryData(lotteryData);

      return true;
    }

    switch (type) {
      case "p3":
        const p3Data = await this.getP3LatestData(
          p3LocalData,
          p3LocalPrizeData
        );
        if (p3Data) await DatabaseModel.writeP3Data(p3Data.list, p3Data.prize);
        break;
      case "p5":
        const p5Data = await this.getP5LatestData(p5LocalData);
        if (p5Data) await DatabaseModel.writeP5Data(p5Data);
        break;
      case "lottery":
        const lotteryData = await this.getLotteryLatestData(lotteryLocalData);
        if (lotteryData) await DatabaseModel.writeLotteryData(lotteryData);
        break;
      default:
        break;
    }
    return true;
  }
}

export default DatabaseService;
