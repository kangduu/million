import readLocalData from "../utils/local";

class LotteryModel {
  // 获取p3奖号数据 中奖数据
  async findP3PrizeData(): Promise<Lottery.PrizeData | null> {
    return await readLocalData<Lottery.PrizeData>("/src/lib/p3-prize.json");
  }

  // 获取p3奖号数据 开奖数据
  async findP3JSONData(): Promise<Lottery.LotteryCommonData[] | null> {
    return await readLocalData<Lottery.LotteryCommonData[]>("/src/lib/p3.json");
  }

  // 获取p5奖号数据 中奖数据
  async findP5JSONData(): Promise<Lottery.LotteryP5Data[] | null> {
    return await readLocalData<Lottery.LotteryP5Data[]>("/src/lib/p5.json");
  }

  // 获取大乐透奖号数据 开奖数据
  async findLotteryJSONData(): Promise<Lottery.LotteryData[] | null> {
    return await readLocalData<Lottery.LotteryData[]>("/src/lib/lottery.json");
  }
}

export default new LotteryModel();
