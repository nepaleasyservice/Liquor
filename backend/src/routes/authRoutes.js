import express from "express";
import { adminLogin } from "../controllers/authController.js";
import { verifyEmail } from "../controllers/authController.js";
import { forgotPassword, resetPassword, signup, login, logout } from "../controllers/userController.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/user/signup", signup);
router.post("/user/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword);
router.post("/user/logout", logout);


export default router;
