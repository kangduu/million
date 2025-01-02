import { Router } from "express";
import lotteryController from "../controllers/lotteryController";
const router = Router();

router.post("/list", lotteryController.getList.bind(lotteryController));

export default router;
