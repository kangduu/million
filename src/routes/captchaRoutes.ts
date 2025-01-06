import { Router, Request, Response } from "express";
import svgCaptcha from "svg-captcha";
import session from "express-session";
import { Session } from "express-session";

declare module "express-session" {
  interface SessionData {
    captcha: string;
  }
}

const router = Router();

// 配置 session 中间件
router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// 生成验证码
router.get("/", (req: Request, res: Response) => {
  const captcha = svgCaptcha.create({
    size: 4, // 验证码长度
    noise: 2, // 干扰线条数
    color: true, // 验证码是否有颜色
    width: 120,
    height: 40,
  });

  // 将验证码文本存储在 session 中
  req.session.captcha = captcha.text;

  res.type("svg");
  res.status(200).send(captcha.data);
});

// 验证验证码
router.post("/verify", (req: Request, res: Response) => {
  const { captchaInput } = req.body;
  const sessionCaptcha = req.session.captcha;

  if (!captchaInput || !sessionCaptcha) {
    return res.status(400).json({ success: false, message: "请提供验证码" });
  }

  const isValid = captchaInput.toLowerCase() === sessionCaptcha.toLowerCase();

  // 验证完后立即删除 session 中的验证码
  delete req.session.captcha;

  res.json({
    success: isValid,
    message: isValid ? "验证码正确" : "验证码错误",
  });
});

export default router;
