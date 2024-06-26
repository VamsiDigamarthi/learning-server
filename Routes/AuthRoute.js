import express from "express";
import {
  onAddTodo,
  onGetAllTodo,
  onGetProfile,
  onLoginUser,
  onRegisterUser,
  onUpdateTodo,
} from "../Controllers/AuthController.js";
import { authenticateToken } from "../middlewares/AuthMiddelware.js";

const router = express.Router();

// register as super-admin

router.post("/register", onRegisterUser);

router.post("/login", onLoginUser);

router.get("/profile", authenticateToken, onGetProfile);

router.post("/add-todo", authenticateToken, onAddTodo);

router.get("/todo", authenticateToken, onGetAllTodo);

router.get("/update-todo/:id", authenticateToken, onUpdateTodo);

export default router;
