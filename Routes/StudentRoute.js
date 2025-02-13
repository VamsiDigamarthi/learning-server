import express from "express";

import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import {
  onAddFeebBack,
  onFetchAllFeebBack,
  // onFecthFeedback,
  // onFetchAllMaterials,
  onFetchAllMentors,
  onFetchFeedBack,
  onFetchFeedBackOrganization,
  onFetchQuized,
  onFetchSuperAdmin,
  onFetchingAllExams,
  onFetchingMcqs,
  onFetchingPdfs,
  onPreview,
  onSubmittedExam,
} from "../Controllers/StudentControllers.js";

const router = express.Router();

router.get("/exams", authenticateToken, onFetchingAllExams);

router.get(
  "/pdfs/:courseName/:instructorId",
  authenticateToken,
  onFetchingPdfs
);

router.post("/fetchmcqs", authenticateToken, onFetchingMcqs);

router.post("/get-quize", authenticateToken, onFetchQuized);

// fetch all mentars details

router.get("/mentors", authenticateToken, onFetchAllMentors);

// fetch all material inroll each all course

// router.post("/all-material", authenticateToken, onFetchAllMaterials);

// finally submitted the exam

router.post("/submitted-exam/:id", authenticateToken, onSubmittedExam);

router.get("/preview/:id", authenticateToken, onPreview);

router.post("/feebback", authenticateToken, onAddFeebBack);

router.get("/get-super-admin", onFetchSuperAdmin);
router.get("/feedback/:instructorId/:courseName", onFetchFeedBack);

router.get("/feedback/:instructorId/", onFetchFeedBackOrganization);

router.get("/fetch-feedback", authenticateToken, onFetchAllFeebBack);

export default router;
