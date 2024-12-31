import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

// JWT 密钥，实际应用中应该存储在环境变量中
const JWT_SECRET = "your-secret-key";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头获取 token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "未提供认证令牌" });
    }

    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    // 将用户信息添加到请求对象中
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "无效的认证令牌" });
  }
};

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
