const { fetchP5, fetchP3, fetchLottery } = require("./fetch");
const logger = require("../utils/logger");
const setFilePath = require("../utils/path");
const { writeLocalFile } = require("../utils/file");

/**
 * 根据给定的请求获取数据，并且可指定结束页
 * @param {*} request 请求函数
 * @param {*} end 结束页
 * @returns Promise<result>
 */
async function requestData(request, end) {
  if (typeof request !== "function")
    throw Error("The request parameter is expected to be a function.");

  function delay() {
    return new Promise((resolve) => {
      const timeout = Math.ceil((Math.random() + 0.5) * 10 * 1000);
      setTimeout(() => {
        resolve(true);
      }, timeout);
    });
  }

  async function getData(page, result = []) {
    logger.info(`Current Page : ${page}`);

    return new Promise(async (resolve, reject) => {
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

/**
 * 获取排列三所有数据
 */
async function getP3FullData() {
  try {
    const data = await requestData(fetchP3);

    const prize = {};
    const list = data.map(
      ({
        prizeLevelList,
        drawPdfUrl,
        lotteryDrawNum,
        lotteryDrawResult,
        lotteryDrawTime,
        totalSaleAmount,
      }) => {
        prize[lotteryDrawNum] = prizeLevelList;
        return {
          pdf: drawPdfUrl,
          num: lotteryDrawNum,
          p3: lotteryDrawResult,
          time: lotteryDrawTime,
          sale: totalSaleAmount,
        };
      }
    );

    writeLocalFile(JSON.stringify(list), setFilePath("../lib", "p3.json"));

    writeLocalFile(
      JSON.stringify(prize),
      setFilePath("../lib", "p3-prize.json")
    );

    logger.info("Permutation 3 Data Success!");
  } catch (error) {
    logger.error(error);
  }
}

/**
 * 获取排列五所有数据
 */
async function getP5FullData() {
  try {
    const data = await requestData(fetchP5);
    const list = data.map(
      ({
        drawPdfUrl,
        lotteryDrawNum,
        lotteryDrawResult,
        lotteryDrawTime,
        poolBalanceAfterdraw,
        prizeLevelList,
        totalSaleAmount,
      }) => {
        const prize = Array.isArray(prizeLevelList) ? prizeLevelList[0] : null;
        return {
          stakeCount: prize ? prize.stakeCount : 0,
          pdf: drawPdfUrl,
          num: lotteryDrawNum,
          p5: lotteryDrawResult,
          time: lotteryDrawTime,
          sale: totalSaleAmount,
          pool: poolBalanceAfterdraw,
        };
      }
    );

    writeLocalFile(JSON.stringify(list), setFilePath("../lib", "p5.json"));

    logger.info("Permutation 5 Data Success!");
  } catch (error) {}
}

/**
 * 获取大乐透所有数据
 */
async function getLotteryFullData() {
  try {
    const data = await requestData(fetchLottery);
    const list = data.map(
      ({
        lotteryDrawNum,
        lotteryDrawResult,
        lotteryDrawTime,
        lotteryUnsortDrawresult,
        poolBalanceAfterdraw,
        totalSaleAmount,
        drawPdfUrl,
      }) => {
        return {
          pdf: drawPdfUrl,
          num: lotteryDrawNum,
          result: lotteryDrawResult,
          time: lotteryDrawTime,
          sale: totalSaleAmount,
          pool: poolBalanceAfterdraw,
          order: lotteryUnsortDrawresult,
        };
      }
    );

    writeLocalFile(JSON.stringify(list), setFilePath("../lib", "lottery.json"));

    logger.info("Lottery Data Success!");
  } catch (error) {}
}

module.exports = { getP3FullData, getLotteryFullData, getP5FullData };
