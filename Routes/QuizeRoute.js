import express from "express";

import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import {
  getAllQuize,
  onAddQuizeMcqs,
} from "../Controllers/QuizeControllers.js";

const router = express.Router();

router.post("/add-quize", authenticateToken, onAddQuizeMcqs);

router.get("/all", authenticateToken, getAllQuize);

export default router;
