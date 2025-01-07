import { Router } from "express";
import userController from "../controllers/userController";
const router = Router();

// 验证码
router.post("/captcha", userController.captcha.bind(userController));
// 登录
router.post("/login", userController.login.bind(userController));
// 登出
router.post("/logout", userController.logout.bind(userController));

// todo 注册
// router.post("/register", userController.register.bind(userController));

export default router;
