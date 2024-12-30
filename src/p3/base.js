function baseLotteryDrawResult() {
  const T3 = [],
    T2 = [],
    T0 = [],
    LotteryDrawResult = [];

  function insertSpace(str) {
    return str.split("").join(" ");
  }

  new Array(1000).fill(null).forEach((_, index) => {
    const value = index.toString().padStart(3, 0);

    LotteryDrawResult.push(insertSpace(value));

    const single = new Set(value);
    // 三数相同
    if (single.size === 3) T0.push(insertSpace(value));
    // 两数相同
    if (single.size === 2) T2.push(insertSpace(value));
    // 全不相同
    if (single.size === 1) T3.push(insertSpace(value));
  });

  return {
    LotteryDrawResult,
    T3,
    T2,
    T0,
  };
}

module.exports = baseLotteryDrawResult;
