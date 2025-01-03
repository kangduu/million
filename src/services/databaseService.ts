import https from "https";
import logger from "../utils/logger";
import getPathCWD from "../utils/path";
import { writeLocalFile } from "../utils/file";

interface RemoteData {
  drawPdfUrl: string;
  lotteryDrawNum: string;
  lotteryDrawResult: string;
  lotteryDrawTime: string;
  totalSaleAmount: string;
  prizeLevelList: any[];
}

type FetchRequestFn<T> = (page: number) => Promise<T>;

class FetchRemoteService {
  private async pullOnePageData(url: string) {
    return new Promise<RemoteData>((resolve, reject) => {
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

  fetchP5: FetchRequestFn<RemoteData> = async (page: number) => {
    this.checkPageType(page);
    return await this.pullOnePageData(this.requestUrl("350133", page));
  };

  fetchP3: FetchRequestFn<RemoteData> = async (page: number) => {
    this.checkPageType(page);
    return await this.pullOnePageData(this.requestUrl("35", page));
  };

  fetchLottery: FetchRequestFn<RemoteData> = async (page: number) => {
    this.checkPageType(page);
    return await this.pullOnePageData(this.requestUrl("85", page));
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
  async requestData<T>(request: FetchRequestFn<T>, end: number): Promise<T[]> {
    if (typeof request !== "function")
      throw Error("The request parameter is expected to be a function.");

    const delay = this.delay;

    async function getData(page: number, result: T[] = []) {
      logger.info(`Current Page : ${page}`);

      return new Promise<T[]>(async (resolve, reject) => {
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

    return await getData(1);
  }
}

class P3Service extends FeatureService {
  constructor() {
    super();
  }

  /**
   * 返回排列三需要存储的数据
   * @param {*} data 远端数据
   * @returns
   */
  private returnPartialP3Data(data: RemoteData) {
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
      return {};
    }
  }

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
      const data = await this.requestData<RemoteData>(this.fetchP3, 100);
      const prize = {};
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
}

class DatabaseService extends FetchRemoteService {
  constructor() {
    super();
  }

  async fetch(type: string): Promise<boolean> {
    // 1. 拉取远端数据

    // 2. 保持到本地

    return true;
  }

  async sync(type: string): Promise<boolean> {
    // 1. 拉取远端数据

    // 2. 保持到本地

    return true;
  }
}

export default DatabaseService;
