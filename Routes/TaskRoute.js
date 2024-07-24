import express from "express";
import path from "path";
import fs from "fs";
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
import TaskModel from "../modals/taskModal.js";

const router = express.Router();

// router.post("/files-upload", authenticateToken, )
router.post(
  "/files-upload/",
  authenticateToken,
  taskUpload.array("files", 10),
  async (req, res) => {
    const { taskId } = req.params;
    const files = req.files;
    const filePaths = [];
    const savedFiles = [];

    for (const file of files) {
      const tempPath = file.path;
      const targetPath = path.join(__dirname, "..", "uploads", file.filename);
      console.log(tempPath);
      try {
        await fs.promises.rename(tempPath, targetPath);
        filePaths.push(targetPath);
        savedFiles.push(file.originalname);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: `File storage failed for ${file.originalname}.`,
        });
      }
    }

    try {
      // Update the Task with the new file paths
      // const task = await TaskModel.findByIdAndUpdate(taskId, {
      //   $push: { taskFiles: { $each: filePaths } },
      // });
      // res.status(200).json({
      //   // success: true,
      //   message: "All files stored and metadata saved successfully.",
      //   // files: savedFiles,
      //   task,
      // });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update task with file paths.",
      });
    }
  }
);

router.post("/add", authenticateToken, taskUpload.array("files", 100), addTask);

router.get("/", authenticateToken, onFetchTrainerOwnTask);

router.delete("/delete/:taskId", authenticateToken, deleteTask);

router.patch(
  "/edit/:taskId",
  authenticateToken,
  taskUpload.array("newFiles", 100),
  onEditTask
);

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
