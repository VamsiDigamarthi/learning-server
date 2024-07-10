import express from "express";

import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import {
  fetchAllPdfs,
  onAddCodingQuestio,
  onAddExams,
  onAddMaterials,
  onAddStudents,
  onAddTest,
  onDeleteBatch,
  onDeleteExam,
  onDeleteTest,
  onEditExam,
  onEditTest,
  onFetchingAllStudents,
  onFetchingAllStudentsProjects,
  onFetchingAllTests,
  onGetAllExams,
} from "../Controllers/AdminControllers.js";
import upload from "../middlewares/fileUploadmiddleware.js";

const router = express.Router();

router.post(
  "/meterials",
  authenticateToken,
  upload.single("pdf"),
  onAddMaterials
);

router.get("/all-pdfs", authenticateToken, fetchAllPdfs);

// add exma
router.post("/add-exam", authenticateToken, onAddExams);

router.post("/add-coding-question", authenticateToken, onAddCodingQuestio);

// get all exams list

router.get("/all-exams", authenticateToken, onGetAllExams);

// add students

router.post("/add-students", authenticateToken, onAddStudents);

// find user
router.get("/all-students", authenticateToken, onFetchingAllStudents);

router.get(
  "/get-all-project-batches-students",
  authenticateToken,
  onFetchingAllStudentsProjects
);

// add test
router.post("/add-test", authenticateToken, onAddTest);

// fetching all test

router.get("/fetching-all-test", authenticateToken, onFetchingAllTests);

router.patch("/edit-test/:testId", onEditTest);

router.delete("/delete-test/:id", onDeleteTest);

// edit exam
router.patch("/edit-exam/:id", onEditExam);
router.delete("/delete-exam/:id", onDeleteExam);

// delete student

router.patch("/delete-batch", onDeleteBatch);

export default router;
