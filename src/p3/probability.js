const { readLocalP3Data, readLocalP5Data } = require("./read-local");

/**
 * 下一期号码未在上期号码中出现的概率
 * @returns string '54.322%'
 */
function probability(data) {
  const length = data.length;
  let repeatFirst = 0,
    repeatSecond = 0,
    repeatThird = 0;
  for (let i = 1; i < length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const [first, second, third] = curr.result.split(" ");
    const repeatedFirst = prev.result.indexOf(first) > -1;
    const repeatedSecond = prev.result.indexOf(second) > -1;
    const repeatedThird = prev.result.indexOf(third) > -1;
    if (repeatedFirst) repeatFirst += 1;
    if (repeatedSecond) repeatSecond += 1;
    if (repeatedThird) repeatThird += 1;
  }

  return [
    ((1 - repeatFirst / length) * 100).toFixed(3) + "%",
    ((1 - repeatSecond / length) * 100).toFixed(3) + "%",
    ((1 - repeatThird / length) * 100).toFixed(3) + "%",
  ];
}

const p3data = readLocalP3Data().reverse();
console.log(probability(p3data));

const p5data = readLocalP5Data().reverse();
console.log(probability(p5data));
