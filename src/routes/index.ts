import { Express } from "express";
import userRoutes from "./userRoutes";
import lotteryRoutes from "./lotteryRoutes";
import databaseRoutes from "./databaseRoutes";
import { verifyToken } from "../middleware/auth";

function insertRoutes(app: Express) {
  const API_VERSION_1 = `/api/${process.env.VERSION_1}`;
  app.use(`${API_VERSION_1}/user`, userRoutes);
  app.use(`${API_VERSION_1}/lottery`, verifyToken, lotteryRoutes);
  app.use(`${API_VERSION_1}/database`, verifyToken, databaseRoutes);
}

export default insertRoutes;
