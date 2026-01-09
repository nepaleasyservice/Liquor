import express from "express";
import getCategory, { getSubCategory } from "../controllers/categoryController.js";

const router = express.Router();

// for category
router.get("/get", getCategory);

// for subcategory
router.get("/sub/get", getSubCategory);
export default router;