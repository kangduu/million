import { Router } from "express";
import userController from "../controllers/userController";
const router = Router();

// 需要登录才能访问的路由
router.post("/login", userController.login.bind(userController));

export default router;
