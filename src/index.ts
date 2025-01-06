import express, { Express } from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import insertRoutes from "./routes";
import logger from "./utils/logger";
import path from "path";

// 加载环境变量
dotenv.config();

// 创建express应用
const app: Express = express();

// 安全相关中间件
app.use(helmet());
app.use(cors());

// 请求解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use(morgan("dev"));

// 静态文件
app.use(express.static("public"));

// API
insertRoutes(app);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 全局错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ message: "服务器内部错误" });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server ${process.env.VERSION_1} is running on port ${PORT}`);
});
