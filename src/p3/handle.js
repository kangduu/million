function analysis(source) {
  const [a, b, c] = source.split(/\s/g).map((val) => Number(val)),
    sortBy = [a, b, c].sort((p, n) => p - n),
    // 众数
    mode = a === b || a === c ? a : b === c ? b : null,
    // 和值
    sum = a + b + c,
    // 平均值
    average = Number((sum / 3).toFixed(3)),
    // 最大值
    max = sortBy[2],
    // 最小值
    min = sortBy[0],
    // 中位数
    median = mode === null ? sortBy[1] : null,
    // 标准差
    std = Math.sqrt(
      (Math.pow(a - average, 2) +
        Math.pow(b - average, 2) +
        Math.pow(c - average, 2)) /
        3
    ),
    // 增序
    climb = a < b && b < c,
    // 递增
    increase = climb && c - b === b - a,
    // 降序
    downhill = a > b && b > c,
    // 递减
    decrease = downhill && a - b === b - c;

  return {
    max,
    min,
    sum,
    mode,
    average,
    median,
    std,
    climb,
    downhill,
    increase,
    decrease,
  };
}

function splitDate(value) {
  const [year, month, day] = value.split("-");
  return { year, month, day };
}
