import { getBrand } from "../controllers/brandController.js";
import express from "express";

const router = express.Router();

router.get("/get", getBrand);

export default router;