import { Router } from "express";
import lotteryController from "../controllers/lotteryController";
const router = Router();

router.post("/list", lotteryController.getList.bind(lotteryController));

// todo 导出数据 , 具体格式待定
// router.post("/export", lotteryController.export.bind(lotteryController));

// todo 通知
// router.post("/notify", lotteryController.notify.bind(lotteryController));

export default router;
