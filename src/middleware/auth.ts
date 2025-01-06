import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 验证token
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      code: 401,
      message: "未提供token",
    });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: "token无效或已过期",
    });
    return;
  }
};
