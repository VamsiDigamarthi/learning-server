import express from "express";
import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import {
  addTask,
  deleteTask,
  onEditTask,
  onFetchingTaskIdWithTaskName,
  onFetchingTaskIdWithTaskNameWithStartData,
  onFetchTrainerOwnTask,
} from "../Controllers/TaskControllers.js";
import taskUpload from "../middlewares/TaskMiddleware.js";

const router = express.Router();

router.post("/add", authenticateToken, taskUpload.array("files", 10), addTask);

router.get("/", authenticateToken, onFetchTrainerOwnTask);

router.delete("/delete/:taskId", authenticateToken, deleteTask);

router.patch("/edit/:taskId", authenticateToken, onEditTask);

router.get(
  "/taskId/:taskId/taskName/:taskName",
  authenticateToken,
  onFetchingTaskIdWithTaskName
);

router.patch(
  "/taskId/:taskId/taskName/:taskName",
  authenticateToken,
  onFetchingTaskIdWithTaskNameWithStartData
);

export default router;
