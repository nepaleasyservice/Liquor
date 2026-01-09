import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getUserList, disableUser, getDashboardData } from "../controllers/adminController.js";

const router = express.Router();

router.get("/user-list", protectAdmin, adminOnly, getUserList);
router.post("/disable-user", protectAdmin, adminOnly, disableUser);

router.get("/admin-dashboard-data", protectAdmin, adminOnly, getDashboardData);

export default router;