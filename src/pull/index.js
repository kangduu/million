const { fetchP5, fetchP3, fetchLottery } = require("./fetch");
const logger = require("../utils/logger");
const getPathCWD = require("../utils/path");
const { writeLocalFile } = require("../utils/file");
const readLocalData = require("../utils/local");

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
 * 返回排列三需要存储的数据
 * @param {*} data
 * @returns
 */
function returnPartialP3Data(data) {
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
    return data;
  }
}

async function writeP3Data(data, prize) {
  await writeLocalFile(JSON.stringify(data), getPathCWD("/src/lib/p3.json"));
  await writeLocalFile(
    JSON.stringify(prize),
    getPathCWD("/src/lib/p3-prize.json")
  );
}

/**
 * 获取排列三所有数据
 */
async function getP3FullData() {
  try {
    const data = await requestData(fetchP3);
    const prize = {};
    const list = data.map(({ prizeLevelList, ...rest }) => {
      prize[rest.lotteryDrawNum] = prizeLevelList;
      return returnPartialP3Data(rest);
    });
    await writeP3Data(list, prize);
    logger.info("Permutation 3 Data Success!");
  } catch (error) {
    logger.error(error);
  }
}

/**
 * 获取排列三最新数据
 */
async function getP3LatestData() {
  try {
    const recentData = await requestData(fetchP3, 1);
    const localData = await readLocalData("/src/lib/p3.json");
    const localPrizeData = await readLocalData("/src/lib/p3-prize.json");

    // update count.
    const latest = [];
    for (let i = 0; i < recentData.length; i++) {
      const { prizeLevelList, ...rest } = recentData[i];
      if (!localData.some((item) => item.time === rest.lotteryDrawTime)) {
        latest.push(returnPartialP3Data(rest));
        localPrizeData[rest.lotteryDrawNum] = prizeLevelList;
      } else break;
    }

    // log length
    const LatestLength = latest.length;
    logger.info(`Total ${LatestLength} Permutation 3 data has been updated.`);

    // write data
    if (LatestLength > 0) {
      localData.unshift(...latest);
      await writeP3Data(localData, localPrizeData);
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
function returnPartialP5Data(data) {
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
      stakeCount: prize ? prize.stakeCount : 0,
      pdf: drawPdfUrl,
      num: lotteryDrawNum,
      result: lotteryDrawResult,
      time: lotteryDrawTime,
      sale: totalSaleAmount,
      pool: poolBalanceAfterdraw,
    };
  } catch (error) {
    return data;
  }
}

/**
 * 获取排列五所有数据
 */
async function getP5FullData() {
  try {
    const data = await requestData(fetchP5);
    const list = data.map((item) => returnPartialP5Data(item));
    await writeLocalFile(JSON.stringify(list), getPathCWD("/src/lib/p5.json"));
    logger.info("Permutation 5 Data Success!");
  } catch (error) {}
}

/**
 * 获取排列五最新数据
 */
async function getP5LatestData() {
  try {
    const recentData = await requestData(fetchP5, 1);
    const localData = await readLocalData("/src/lib/p5.json");

    // update count.
    const latest = [];
    for (let i = 0; i < recentData.length; i++) {
      const curr = recentData[i];
      if (!localData.some((item) => item.time === curr.lotteryDrawTime)) {
        latest.push(returnPartialP5Data(curr));
      } else break;
    }

    // log length
    const LatestLength = latest.length;
    logger.info(`Total ${LatestLength} Permutation 5 data has been updated.`);

    // write data
    if (LatestLength > 0) {
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
function returnPartialLotteryData(data) {
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
    return data;
  }
}

/**
 * 获取大乐透所有数据
 */
async function getLotteryFullData() {
  try {
    const data = await requestData(fetchLottery);
    const list = data.map((item) => returnPartialLotteryData(item));
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
async function getLotteryLatestData() {
  try {
    const recentData = await requestData(fetchLottery, 1);
    const localData = await readLocalData("/src/lib/lottery.json");

    // update count.
    const latest = [];
    for (let i = 0; i < recentData.length; i++) {
      const curr = recentData[i];
      if (!localData.some((item) => item.time === curr.lotteryDrawTime)) {
        latest.push(returnPartialLotteryData(curr));
      } else break;
    }

    // log length
    const LatestLength = latest.length;
    logger.info(`Total ${LatestLength} Lottery data has been updated.`);

    // write data
    if (LatestLength > 0) {
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

module.exports = {
  getP3FullData,
  getLotteryFullData,
  getP5FullData,
  getP3LatestData,
  getP5LatestData,
  getLotteryLatestData,
};
