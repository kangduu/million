declare namespace Lottery {
  type LotteryType = "p3" | "p5" | "lottery";

  // 开奖数据
  interface LotteryCommonData {
    pdf: string;
    num: string;
    result: string;
    time: string;
    sale: string;
  }

  // 大乐透开奖数据
  interface LotteryData extends LotteryCommonData {
    pool: string;
    order: string;
  }
} 