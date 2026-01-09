import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { createEnjoy } from "../controllers/enjoyController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getEnjoys } from "../controllers/enjoyController.js";
import { DeleteEnjoy } from "../controllers/enjoyController.js";
import { editEnjoy } from "../controllers/enjoyController.js";

const router = express.Router();

router.post(
    "/create/",
    protectAdmin,
    adminOnly,
    upload.single("photo"),
    createEnjoy
)

router.get(
    "/get",
    getEnjoys
);

router.delete(
    "/delete/:id",
    protectAdmin,
    adminOnly,
    DeleteEnjoy
)

router.put(
    "/update/:id",
    protectAdmin,
    adminOnly,
    upload.single("photo"),
    editEnjoy
)
export default router;