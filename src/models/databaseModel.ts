import { writeLocalFile } from "../utils/file";
import getPathCWD from "../utils/path";

class DatabaseModel {
  /**
   * 将排列三数据写入本地
   * @param data
   * @param prize
   */
  async writeP3Data(data: Lottery.LotteryCommonData[], prize: any) {
    await writeLocalFile(JSON.stringify(data), getPathCWD("/src/lib/p3.json"));
    await writeLocalFile(
      JSON.stringify(prize),
      getPathCWD("/src/lib/p3-prize.json")
    );
  }

  /**
   * 将排列五数据写入本地
   * @param data
   */
  async writeP5Data(data: Lottery.LotteryP5Data[]) {
    await writeLocalFile(JSON.stringify(data), getPathCWD("/src/lib/p5.json"));
  }

  /**
   * 将彩票数据写入本地
   * @param data
   */
  async writeLotteryData(data: Lottery.LotteryData[]) {
    await writeLocalFile(
      JSON.stringify(data),
      getPathCWD("/src/lib/lottery.json")
    );
  }
}

export default new DatabaseModel();
