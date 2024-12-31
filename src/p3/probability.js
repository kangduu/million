const { readLocalP3Data, readLocalP5Data } = require("./read-local");

/**
 * 下一期号码未在上期号码中出现的概率
 * @param data - 彩票数据数组
 * @returns { prob: string[], repeated1: [], repeated2: [], repeated3: [] }
 */
function probability(data) {
  const length = data.length;
  let repeatFirst = 0,
    repeatSecond = 0,
    repeatThird = 0;
  let repeated1 = [],
    repeated2 = [],
    repeated3 = [];
  for (let i = 1; i < length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const [first, second, third] = curr.result.split(" ");
    const repeatedFirst = prev.result.indexOf(first) > -1;
    const repeatedSecond = prev.result.indexOf(second) > -1;
    const repeatedThird = prev.result.indexOf(third) > -1;
    if (repeatedFirst) {
      repeatFirst += 1;
      repeated1.push([curr.num, prev.result, curr.result]);
    }
    if (repeatedSecond) {
      repeatSecond += 1;
      repeated2.push([curr.num, prev.result, curr.result]);
    }
    if (repeatedThird) {
      repeatThird += 1;
      repeated3.push([curr.num, prev.result, curr.result]);
    }
  }

  const prob = [
    ((1 - repeatFirst / length) * 100).toFixed(3) + "%",
    ((1 - repeatSecond / length) * 100).toFixed(3) + "%",
    ((1 - repeatThird / length) * 100).toFixed(3) + "%",
  ];

  return { prob, repeated1, repeated2, repeated3 };
}

/**
 * 连续出现的次数
 * @param data - 彩票数据数组
 * @returns { max: number, counts: object }
 */
function continuous(data) {
  const counts = {};
  let max = 0;
  let cacheNum = "",
    count = 0;
  data.forEach((element) => {
    const [num] = element;
    const prev = cacheNum;
    cacheNum = num;
    const diff = num - prev;
    if (diff === 1) count += 1;
    else {
      if (count) counts[count] = (counts[count] || 0) + 1;
      if (count > max) max = count;
      count = 0;
    }
  });

  return { max, counts };
}

function p3probability() {
  const p3data = readLocalP3Data().reverse();
  const prob = probability(p3data);
  const c1 = continuous(prob.repeated1);
  const c2 = continuous(prob.repeated2);
  const c3 = continuous(prob.repeated3);
  return { ...prob, c1, c2, c3 };
}

const p3 = p3probability();

console.log(p3.c1, p3.c2, p3.c3);

function p5probability() {
  const p5data = readLocalP5Data().reverse();
  const prob = probability(p5data);
  const c1 = continuous(prob.repeated1);
  const c2 = continuous(prob.repeated2);  
  const c3 = continuous(prob.repeated3);
  return { ...prob, c1, c2, c3 };
}

const p5 = p5probability();


module.exports = { p3probability, p5probability };
