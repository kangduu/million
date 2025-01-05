import { Express } from "express";
import userRoutes from "./userRoutes";
import lotteryRoutes from "./lotteryRoutes";
import databaseRoutes from "./databaseRoutes";

function insertRoutes(app: Express) {
  const API_VERSION_1 = `/api/${process.env.VERSION_1}`;

  app.use(`${API_VERSION_1}/user`, userRoutes);
  app.use(`${API_VERSION_1}/lottery`, lotteryRoutes);
  app.use(`${API_VERSION_1}/database`, databaseRoutes);
}

export default insertRoutes;
