import https from "https";
import logger from "../utils/logger";
import getPathCWD from "../utils/path";
import { writeLocalFile } from "../utils/file";
import readLocalData from "../utils/local";

interface PrizeRecord {
  prizeLevel: string;
  stakeCount: string;
  stakeAmount: string;
  stakeAmountFormat: string;
  totalPrizeamount: string;
  sort: number;
  awardType: number;
  lotteryCondition: unknown;
  group: unknown;
}

type PrizeData = Record<string, PrizeRecord[]>;

interface RemoteData {
  drawPdfUrl: string;
  lotteryDrawNum: string;
  lotteryDrawResult: string;
  lotteryDrawTime: string;
  totalSaleAmount: string;
  prizeLevelList: PrizeRecord[];
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
   * 将排列三数据写入本地
   * @param data
   * @param prize
   */
  private async writeP3Data(data: Lottery.LotteryCommonData[], prize: any) {
    await writeLocalFile(JSON.stringify(data), getPathCWD("/src/lib/p3.json"));
    await writeLocalFile(
      JSON.stringify(prize),
      getPathCWD("/src/lib/p3-prize.json")
    );
  }

  /**
   * 获取排列三所有数据
   */
  async getP3FullData() {
    try {
      const data = await this.requestData(this.fetchP3);
      const prize: PrizeData = {};
      const list = data.map(({ prizeLevelList, ...rest }: RemoteData) => {
        prize[rest.lotteryDrawNum] = prizeLevelList;
        return this.returnPartialP3Data(rest);
      });
      await this.writeP3Data(list, prize);
      logger.info("Permutation 3 Data Success!");
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * 获取排列三最新数据
   */
  async getP3LatestData() {
    try {
      const recentData = await this.requestData(this.fetchP3, 1);
      const localData = await readLocalData<Lottery.LotteryCommonData[]>(
        "/src/lib/p3.json"
      );
      const localPrizeData = await readLocalData<PrizeData>(
        "/src/lib/p3-prize.json"
      );

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
      logger.info(`Total ${LatestLength} Permutation 3 data has been updated.`);

      // write data
      if (LatestLength > 0 && localData) {
        localData.unshift(...latest);
        await this.writeP3Data(localData, localPrizeData);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * 返回排列五需要存储的数据
   * @param {*} data
   * @returns
   */
  returnPartialP5Data(data: RemoteP5Data): Lottery.LotteryP5Data {
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
  async getP5FullData() {
    try {
      const data = await this.requestData(this.fetchP5);
      const list = data.map((item) => this.returnPartialP5Data(item));
      await writeLocalFile(
        JSON.stringify(list),
        getPathCWD("/src/lib/p5.json")
      );
      logger.info("Permutation 5 Data Success!");
    } catch (error) {}
  }

  /**
   * 获取排列五最新数据
   */
  async getP5LatestData() {
    try {
      const recentData = await this.requestData(this.fetchP5, 1);
      const localData = await readLocalData<Lottery.LotteryP5Data[]>(
        "/src/lib/p5.json"
      );

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
      logger.info(`Total ${LatestLength} Permutation 5 data has been updated.`);

      // write data
      if (LatestLength > 0 && localData) {
        localData.unshift(...latest);
        await writeLocalFile(
          JSON.stringify(localData),
          getPathCWD("/src/lib/p5.json")
        );
      }
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * 返回大乐透需要存储的数据
   * @param {*} data
   * @returns
   */
  returnPartialLotteryData(data: RemoteLotteryData): Lottery.LotteryData {
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
  async getLotteryFullData() {
    try {
      const data = await this.requestData(this.fetchLottery);
      const list = data.map((item) => this.returnPartialLotteryData(item));
      await writeLocalFile(
        JSON.stringify(list),
        getPathCWD("/src/lib/lottery.json")
      );
      logger.info("Lottery Data Success!");
    } catch (error) {}
  }

  /**
   * 获取大乐透最新数据
   */
  async getLotteryLatestData() {
    try {
      const recentData = await this.requestData(this.fetchLottery, 1);
      const localData = await readLocalData<Lottery.LotteryData[]>(
        "/src/lib/lottery.json"
      );

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
        await writeLocalFile(
          JSON.stringify(localData),
          getPathCWD("/src/lib/lottery.json")
        );
      }
    } catch (error) {
      logger.error(error);
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
        this.getP3FullData();
        break;
      case "p5":
        this.getP5FullData();
        break;
      case "lottery":
        this.getLotteryFullData();
        break;
      default:
        break;
    }
    return true;
  }

  async sync(type: Lottery.LotteryType): Promise<boolean> {
    // 更新所有数据
    if (type === undefined) {
      this.getP3LatestData();
      this.getP5LatestData();
      this.getLotteryLatestData();
      return true;
    }

    switch (type) {
      case "p3":
        this.getP3LatestData();
        break;
      case "p5":
        this.getP5LatestData();
        break;
      case "lottery":
        this.getLotteryLatestData();
        break;
      default:
        break;
    }
    return true;
  }
}

export default DatabaseService;
