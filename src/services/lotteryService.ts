import lotteryModel from "../models/lotteryModel";

class LotteryService {
  //  分页函数
  pagination(page: number, pagesize: number) {
    if (page < 1) throw new Error("page must be greater than 0");
    if (pagesize < 1) throw new Error("pagesize must be greater than 0");

    const start = (page - 1) * pagesize;
    const limit = pagesize;
    return { start, limit };
  }

  // 获取p3开奖数据
  async getP3List(page: number, pagesize: number) {
    const { start, limit } = this.pagination(page, pagesize);
    const data = await lotteryModel.findP3JSONData();
    return {
      data: data?.slice(start, limit) || [],
      pagination: {
        total: data?.length || 0,
        page,
        pagesize,
      },
    };
  }

  // 获取p5开奖数据
  async getP5List(page: number, pagesize: number) {
    const { start, limit } = this.pagination(page, pagesize);
    const data = await lotteryModel.findP5JSONData();
    return {
      data: data?.slice(start, limit) || [],
      pagination: {
        total: data?.length || 0,
        page,
        pagesize,
      },
    };
  }

  // 获取大乐透开奖数据
  async getLotteryList(page: number, pagesize: number) {
    const { start, limit } = this.pagination(page, pagesize);
    const data = await lotteryModel.findLotteryJSONData();
    return {
      data: data?.slice(start, limit) || [],
      pagination: {
        total: data?.length || 0,
        page,
        pagesize,
      },
    };
  }
}

export default LotteryService;
