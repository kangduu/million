import { Request, Response } from "express";
import DatabaseService from "../services/databaseService";
class DatabaseController {
  private databaseService: DatabaseService;
  constructor() {
    this.databaseService = new DatabaseService();
  }
  // * 这里需要调用service层执行任务，然后告诉客户端任务状态，重点内容如下：
  // 1. websocket 连接实现
  // 2. 任务机制
  // 3. 服务端缓存机制
  // ! 任务执行完毕后，告诉客户端任务执行完毕
  // ! 任务执行失败，告诉客户端任务执行失败
  // ! 任务执行中，告诉客户端任务执行中

  // todo 拉取远端数据 remote， 并保持到本地
  async pull(req: Request, res: Response) {
    const { type } = req.body;
    const success = await this.databaseService.fetch(type);
    if (success) {
      res.status(200).json({
        message: "pull data success",
      });
    } else {
      res.status(500).json({
        message: "pull data failed",
      });
    }
  }

  // todo 更新并同步远端数据， 并保持到本地
  async latest(req: Request, res: Response) {}
}

export default new DatabaseController();