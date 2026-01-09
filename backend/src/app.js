import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import dbConnect from "./db/dbConnect.js";

const app = express();

/* middleware FIRST */
app.use(express.json());
app.use(
  cors({
    origin: ["https://liquorfrontend.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

/* routes */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* connect DB BEFORE routes */
await dbConnect();

/* static */
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

/* routes */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/khalti", khaltiRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/enjoy", enjoyRoutes);

export default app;
