const {
  getCountNumber,
  getFrequencyList,
  getFrequencyAndLatestYear,
  getTargetFrequency,
} = require("./analysis");

const {
  T3Frequency,
  T2Frequency,
  T0Frequency,
  getAllResultFrequency,
} = require("./analysis/frequency");

const frequency = getFrequencyList();
// console.log(frequency.sort((a, b) => b - a));

console.log(getCountNumber(0));

// console.log(T3Frequency.reverse());
// console.log(T2Frequency.reverse());
// console.log(T0Frequency.reverse());

// console.log(getAllResultFrequency());

// console.log(getFrequencyAndLatestYear(0).length);

// console.log(getTargetFrequency("0 2 3"));
