import { Request, Response } from "express";
import jwt from "jsonwebtoken";
class AuthController {
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
}

export default new AuthController();
