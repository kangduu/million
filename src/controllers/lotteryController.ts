import { Request, Response } from "express";
import LotteryService from "../services/lotteryService";
import logger from "../utils/logger";

class LotteryController {
  private lotteryService: LotteryService;

  constructor() {
    this.lotteryService = new LotteryService();
  }

  async getList(req: Request, res: Response) {
    try {
      const page = req.body.page;
      const pagesize = req.body.pagesize;
      const type = req.body.type;

      let data: any = [];
      switch (type) {
        case "p3":
          data = await this.lotteryService.getP3List(page, pagesize);
          break;

        case "p5":
          data = await this.lotteryService.getP5List(page, pagesize);
          break;

        case "lottery":
          data = await this.lotteryService.getLotteryList(page, pagesize);
          break;

        default:
          res.status(400).json({ error: "Invalid type" });
          break;
      }

      logger.info(`get lottery data success: ${type}`);

      res.status(200).json({
        code: 200,
        message: "success",
        ...data,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        code: 500,
        message: "Internal server error",
      });
    }
  }
}

export default new LotteryController();
