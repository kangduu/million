import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/userService";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (username === "admin" && password === "123456") {
      const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      res.json({ token });
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

export default new UserController();
