import express from "express";

import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import {
  onAddedNewCourse,
  onFetchAllExams,
  onFetchAllStudent,
  onFetchAllTest,
  onFetchAllTrainer,
} from "../Controllers/SuperAdminController.js";

const router = express.Router();

router.patch("/added-new-couse-to-admin/:id", onAddedNewCourse);

router.get("/fetch-all-trainer", onFetchAllTrainer);

router.get("/all-tests", onFetchAllTest);

// all student bacth wise
router.get("/all-student", onFetchAllStudent);

// exam lis

router.get("/all-exams", onFetchAllExams);
export default router;
