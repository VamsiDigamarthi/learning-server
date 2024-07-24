import express from "express";
import {
  onAddTodo,
  onBankChange,
  onChangeBio,
  onChangePassword,
  onChangePersonalInfo,
  onChangeProfessinalInfo,
  onChangeResume,
  onCheckingUser,
  onEddEducation,
  onExpericesChange,
  onFetchNewLogin,
  onGetAllTodo,
  onGetProfile,
  onRegisterUser,
  onSendOtp,
  onUpdateProfile,
  onUpdateTodo,
  onVerifyOtp,
} from "../Controllers/AuthController.js";
import { authenticateToken } from "../middlewares/AuthMiddelware.js";
import imageUpload from "../middlewares/imageUploadMiddleware.js";
import upload from "../middlewares/fileUploadmiddleware.js";

const router = express.Router();

// register as super-admin

router.post("/register", onRegisterUser); //-

// router.post("/login", onLoginUser);

router.get("/profile", authenticateToken, onGetProfile); //-

router.patch(
  "/profilePic",
  authenticateToken,
  imageUpload.single("image"),
  onUpdateProfile
); //-

router.patch(
  "/professinal-information",
  authenticateToken,
  onChangeProfessinalInfo
); //-

router.patch("/personal-information", authenticateToken, onChangePersonalInfo); //-

router.patch("/bio", authenticateToken, onChangeBio); //-

router.patch("/experices", authenticateToken, onExpericesChange);

router.patch("/education", authenticateToken, onEddEducation); //-

router.patch(
  "/resume",
  authenticateToken,
  upload.single("pdf"),
  onChangeResume
); //-

router.patch("/bank-info", authenticateToken, onBankChange); //-

router.patch("/change-pass", authenticateToken, onChangePassword); //-

//
router.post("/add-todo", authenticateToken, onAddTodo); //-

router.get("/todo", authenticateToken, onGetAllTodo);

router.get("/update-todo/:id", authenticateToken, onUpdateTodo);

// verity-userId
router.get("/checing-user/:userId", onCheckingUser);

router.post("/send-otp", onSendOtp);

router.post("/verify-otp", onVerifyOtp);

router.post("/login", onFetchNewLogin); //-

export default router;
