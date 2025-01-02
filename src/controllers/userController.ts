import { Request, Response } from "express";
import UserService from "../services/userService";
import { generateToken } from "../utils/jwt";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }


  async login(req: Request, res: Response) {
    const { username, passwd } = req.body;
    // todo 查询数据库, 判断用户名和密码是否正确
    if (username === "admin" && passwd === "123456") {
      // todo 用户信息，id 等
      const user = await this.userService.getUserByUsername(username);
      // todo 保存token到数据库, 并返回token
      const token = generateToken(username);
      res.json({ token, user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default  new  UserController();
