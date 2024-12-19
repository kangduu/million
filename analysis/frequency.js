const readJSONDataSource = require("../utils/readJSONDataSource");

const baseLotteryDrawResult = require("./base");
const { LotteryDrawResult, T3, T2, T0 } = baseLotteryDrawResult();

function setFrequencyZero(result) {
  return { count: 0, times: [], lotteryDrawResult: result };
}

/**
 * 获取所有开奖结果的统计次数
 * @returns
 */
function getAllResultFrequency() {
  const dataSource = readJSONDataSource();
  const frequency = {};
  dataSource.forEach(({ lotteryDrawResult, lotteryDrawTime }) => {
    if (frequency[lotteryDrawResult]) {
      frequency[lotteryDrawResult] = {
        lotteryDrawResult,
        count: frequency[lotteryDrawResult].count + 1,
        times: [...frequency[lotteryDrawResult].times, lotteryDrawTime],
      };
    } else {
      frequency[lotteryDrawResult] = {
        lotteryDrawResult,
        count: 1,
        times: [lotteryDrawTime],
      };
    }
  });

  const result = LotteryDrawResult.reduce((prev, curr) => {
    prev[curr] = frequency[curr] || setFrequencyZero(curr);
    return prev;
  }, {});

  return result;
}

/**
 * 获取指定目标的开奖次数
 * @param {*} target
 * @returns
 */
function frequency(target) {
  const results = getAllResultFrequency();
  return target
    .reduce((prev, curr) => {
      let data = setFrequencyZero(curr);
      if (results[curr]) data = results[curr];
      prev.push(data);
      return prev;
    }, [])
    .sort((a, b) => a.count - b.count);
}

function getT3Frequency() {
  return frequency(T3);
}

function getT2Frequency() {
  return frequency(T2);
}

function getT0Frequency() {
  return frequency(T0);
}

module.exports.T3Frequency = getT3Frequency();
module.exports.T2Frequency = getT2Frequency();
module.exports.T0Frequency = getT0Frequency();
module.exports.getAllResultFrequency = getAllResultFrequency;
