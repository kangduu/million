import { Request, Response } from "express";
import LotteryService from "../services/lotteryService";
import { verifyToken } from "../utils/jwt";

class UserController {
  private lotteryService: LotteryService;

  constructor() {
    this.lotteryService = new LotteryService();
  }

  async getList(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      await verifyToken(token || "");

      const page = req.body.page;
      const pageSize = req.body.pageSize;
      const users = await this.lotteryService.getList(page, pageSize);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new UserController();
