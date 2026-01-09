import express from "express";
import { protectAdmin, protectUser } from "../middleware/authMiddleware.js";
import { createOrder, getParticularOrder, getOrderForUser, getOrderForAdmin } from "../controllers/orderController.js";

const router = express.Router();

router.get("/get", protectUser, getOrderForUser);
router.get("/get-admin-orders", protectAdmin, getOrderForAdmin);

router.post("/", protectUser, createOrder);

router.get("/:orderId", getParticularOrder);

export default router;

