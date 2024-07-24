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
  onFetchSuperAdminStudentTask,
  onFetchSuperAdminTrainerTask,
  onGetAllBatchStudents,
  onOrganizationFetchTrainerFeedbackGiveStudent,
  onOrganizationOwnFeedback,
  onPostFeedBack,
} from "../Controllers/SuperAdminController.js";

const router = express.Router();

router.patch("/added-new-couse-to-admin/:id", onAddedNewCourse); //-

router.get("/fetch-all-trainer", authenticateToken, onFetchAllTrainer); //-

router.get("/all-tests", authenticateToken, onFetchAllTest);

// all student bacth wise
router.get("/all-student", onFetchAllStudent); //@

// exam lis

router.get("/all-exams", authenticateToken, onFetchAllExams);

// 05-07-2024

router.get("/all-batch-students", onGetAllBatchStudents); //@

router.get("/all-mentors", onFetchAllMentors); // -

router.get("/material/:courseName", onFetchAllMaterialByTrainer);

router.delete("/delete-mentor/:trainerId", onDeletementor); //-

// feed back

router.post("/feed-back", authenticateToken, onPostFeedBack);

router.post("/add-trainer", authenticateToken, onAddTriner);

router.get("/trainer-task", authenticateToken, onFetchSuperAdminTrainerTask);

router.get("/student-task", authenticateToken, onFetchSuperAdminStudentTask);

router.post(
  "/organization-feedback",
  authenticateToken,
  onOrganizationOwnFeedback
);

// feed back fetching --- trainers

router.get(
  "/trainer-feedback/:instructorId/:courseName",
  authenticateToken,
  onOrganizationFetchTrainerFeedbackGiveStudent
);

// router.get("/trainer-feedback/:instructorId/", authenticateToken, onOrganizationOwnFeedback);

// feed back fetching --- students

export default router;
