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

  interface LotteryP5Data extends LotteryCommonData {
    stakeCount: string;
    pool: string;
  }

  // 大乐透开奖数据
  interface LotteryData extends LotteryCommonData {
    pool: string;
    order: string;
  }

  interface PrizeRecord {
    prizeLevel: string;
    stakeCount: string;
    stakeAmount: string;
    stakeAmountFormat: string;
    totalPrizeamount: string;
    sort: number;
    awardType: number;
    lotteryCondition: unknown;
    group: unknown;
  }

  type PrizeData = Record<string, PrizeRecord[]>;
}
