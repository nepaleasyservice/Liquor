import express from "express";
import {
    getProducts,
    createProduct,
    publishProduct,
    editProduct,
    featureProduct,
    getParticularProduct,
    deleteProduct
} from "../controllers/productController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get(
    "/list",
    getProducts,
)

router.get(
    "/list/:id",
    getParticularProduct,
)

router.post(
    "/create",
    protectAdmin,
    adminOnly,
    upload.single("imageUrl"),
    createProduct,
)

router.post(
    "/publish/:id",
    protectAdmin,
    adminOnly,
    publishProduct
)

router.post(
    "/feature/:id",
    protectAdmin,
    adminOnly,
    featureProduct
)

router.put(
    "/edit/:id",
    protectAdmin,
    adminOnly,
    upload.single("imageUrl"),
    editProduct
)

router.delete(
    "/delete/:id",
    protectAdmin,
    adminOnly,
    deleteProduct
)

export default router;