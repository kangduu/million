const { getAllResultFrequency } = require("./frequency");

/**
 * 次数统计
 * @returns number[] seem as [max, ..., min]
 */
function getFrequencyList() {
  const data = getAllResultFrequency();
  const list = new Set();
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      list.add(value.count);
    }
  }

  const result = Array.from(list).sort((a, b) => b - a);
  return result;
}

/**
 * 获取出现指定次数的结果
 * @param {*} frequency 出现次数
 * @returns Array<{ count: number, times: string[], result: '' }>
 */
function getCountNumber(frequency = 1) {
  const data = getAllResultFrequency();
  const result = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (value.count === frequency) result.push(value);
    }
  }
  return result;
}

/**
 * 找出 【出现次数 >= 最小次数 & 【出现次数 < 最大次数】 & 【当前年份】 未开出的号码推荐
 * @param {*} min 最小次数
 * @param {*} max 最大次数】
 * @returns string[] seem as [ '4 8 9===16', '2 9 9===15', '4 8 8===15' ]
 */
function getFrequencyAndLatestYear(
  min,
  max = 100 /* 默认100次，理论上一定小于100 */
) {
  const Connecter = "===";
  const CurrentYear = new Date().getFullYear().toString();
  const Result = getAllResultFrequency();

  let recommend = [];

  for (const key in Result) {
    if (Object.prototype.hasOwnProperty.call(Result, key)) {
      const { count, result, times } = Result[key];
      if (
        count < max &&
        count >= min &&
        times[0] &&
        times[0].split("-")[0] !== CurrentYear
      ) {
        recommend.push(`${result}${Connecter}${count}`);
      }
    }
  }

  recommend.sort((a, b) => b.split(Connecter)[1] - a.split(Connecter)[1]);

  return recommend;
}

/**
 * 查看指定号码的开奖历史数据
 * @param {*} target string
 * @returns `{ count: number, times: string[], result: target }`
 */
function getTargetFrequency(target) {
  const Result = getAllResultFrequency();
  return Result[target];
}

module.exports = {
  getCountNumber,
  getFrequencyList,
  getFrequencyAndLatestYear,
  getTargetFrequency,
};
