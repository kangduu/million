import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(
  req: Request<{}, {}, {}, {}, Record<string, any>>,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await verifyToken(token);
    req.user = decoded; // 将解码后的用户信息附加到请求对象
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// 角色验证中间件
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "未经授权" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "权限不足" });
    }

    next();
  };
};
