const readLocalP3Data = require("./read-local");

/**
 * 下一期百位数号码未在上期号码中出现的概率
 * @returns string '54.322%'
 */
function hitHundredsProbability() {
  const data = readLocalP3Data().reverse();
  const length = data.length;
  let repeat = 0;
  for (let i = 1; i < length; i++) {
    const prev = data[i - 1];
    const curr = data[i];

    const first = curr.result.split(" ")[0];
    const repeated = prev.result.indexOf(first) > -1;

    if (repeated) repeat += 1;
  }

  return ((1 - repeat / length) * 100).toFixed(3) + "%";
}
console.log(hitHundredsProbability());

function hitTens() {}
