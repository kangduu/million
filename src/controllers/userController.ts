import { Request, Response } from "express";
import crypto from "crypto";
import svgCaptcha from "svg-captcha";
import dayjs from "dayjs";
import UserService from "../services/userService";
import { generateToken } from "../utils/jwt";

class UserController {
  #userService: UserService;
  #captchaStore = new Map<string, string>();

  constructor() {
    this.#userService = new UserService();
  }

  async logout(req: Request, res: Response) {
    const { id } = req.body;
    // todo 删除token, 使token失效, 修改指定id用户的登录状态

    const token = req.headers.authorization?.split(" ")[1];

    console.log(id, token);

    res.json({ code: 200, msg: "Success" });
  }

  async login(req: Request, res: Response) {
    // todo 查询数据库, 判断用户名和密码是否正确
    const { username, password, captcha, captchaId } = req.body;

    let isValid = true,
      error = "";

    if (!username || !password) {
      isValid = false;
      error = "用户名或密码不能为空";
    }
    if ((!captcha || !captchaId) && isValid) {
      isValid = false;
      error = "验证码不能为空";
    }

    if (username !== "admin" || password !== "123456") {
      isValid = false;
      error = "用户名或密码错误";
    }

    const sessionCaptcha = this.#captchaStore.get(captchaId);
    if (!sessionCaptcha && isValid) {
      isValid = false;
      error = "验证码已过期";
    }

    if (sessionCaptcha !== captcha.toLowerCase() && isValid) {
      isValid = false;
      error = "验证码错误";
    }

    if (!isValid) {
      res.status(200).json({
        code: 400,
        msg: error,
        data: null,
      });
      return;
    }

    // todo 用户信息，id 等
    const user = await this.#userService.getUserByUsername(username);
    // todo 保存token到数据库, 并返回token
    const token = generateToken(username);
    // 过期时间
    const expired_at = dayjs().add(1, "days").format("YYYY-MM-DD HH:mm:ss");

    // 清除验证码
    this.#captchaStore.clear();

    res.status(200).json({
      code: 200,
      msg: "Success",
      data: { token, user, expired_at },
    });
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.#userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  captcha(req: Request, res: Response) {
    const captcha = svgCaptcha.create({
      size: 6, // 验证码的字符长度
      noise: 4, // 添加噪点，增加干扰
      color: true, // 字符颜色
      background: "#f0f0f0", // 背景颜色
      fontSize: 50, // 字体大小
      width: 150, // 宽度
      height: 50, // 高度
      inverse: false, // 是否反色
    });

    const sessionId = crypto.randomBytes(16).toString("hex");
    this.#captchaStore.clear();
    this.#captchaStore.set(sessionId, captcha.text.toLowerCase());

    // res.set("Content-Type", "image/svg+xml");
    // res.status(200).send(captcha.data);
    res.json({
      code: 200,
      data: {
        img: captcha.data,
        id: sessionId,
      },
      message: "验证码生成成功",
    });
  }
}

export default new UserController();
