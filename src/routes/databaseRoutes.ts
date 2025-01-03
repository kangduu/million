import { Router } from "express";
import databaseController from "../controllers/databaseController";
const router = Router();

router.post("/remote", databaseController.pull.bind(databaseController));
router.post("/latest", databaseController.latest.bind(databaseController));

export default router;
