import express from "express";

import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import {
  fetchAllPdfs,
  onAddExams,
  onAddMaterials,
  onAddStudents,
  onAddTest,
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

export default router;
