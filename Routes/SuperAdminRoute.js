import express from "express";

import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import {
  onAddedNewCourse,
  onAddTriner,
  onDeletementor,
  onFetchAllExams,
  onFetchAllMaterialByTrainer,
  onFetchAllMentors,
  onFetchAllStudent,
  onFetchAllTest,
  onFetchAllTrainer,
  onGetAllBatchStudents,
  onPostFeedBack,
} from "../Controllers/SuperAdminController.js";

const router = express.Router();

router.patch("/added-new-couse-to-admin/:id", onAddedNewCourse);

router.get("/fetch-all-trainer", authenticateToken, onFetchAllTrainer);

router.get("/all-tests", onFetchAllTest);

// all student bacth wise
router.get("/all-student", onFetchAllStudent);

// exam lis

router.get("/all-exams", onFetchAllExams);

// 05-07-2024

router.get("/all-batch-students", onGetAllBatchStudents);

router.get("/all-mentors", onFetchAllMentors);

router.get("/material/:trainerId/:courseName", onFetchAllMaterialByTrainer);

router.delete("/delete-mentor/:trainerId", onDeletementor);

// feed back

router.post("/feed-back", onPostFeedBack);

router.post("/add-trainer", authenticateToken, onAddTriner);

export default router;
