import lotteryModel from "../models/lotteryModel";

class LotteryService {
  async getList(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const users = await lotteryModel.find().skip(skip).limit(limit);
    return users;
  }
}

export default LotteryService;
