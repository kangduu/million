import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes";
import lotteryRoutes from "./routes/lotteryRoutes";

// 加载环境变量
dotenv.config();

// 创建express应用
const app = express();

// 安全相关中间件
app.use(helmet());
app.use(cors());

// 请求解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use(morgan("dev"));

// API 版本前缀
const API_VERSION_1 = `/api/${process.env.VERSION_1}`;

// API路由
app.use(`${API_VERSION_1}/user`, userRoutes);
app.use(`${API_VERSION_1}/lottery`, lotteryRoutes);

// 全局错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "服务器内部错误" });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
