import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser"

import { emailMiddleware } from "./middleware/emailMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";

import enjoyRoutes from "./routes/enjoyRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

// khalti integration imports
import khaltiRoutes from "./routes/khalti.js";
import orderRoutes from "./routes/orderRoutes.js";
import dbConnect from "./db/dbConnect.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "https://liquor-beta.vercel.app"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

//  AUTH ROUTES
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src/uploads"))
);

app.use(emailMiddleware);

app.get("/", (req,res) => {
  res.send("Api working!");
})

    await dbConnect(); // ✅ wait for DB first

app.use("/api/auth", authRoutes);

// admin route
app.use("/api/admin", adminRoutes);

// khalti dependency injection
app.use("/api/khalti", khaltiRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/products", productRoutes);

app.use("/api/enjoy", enjoyRoutes);

export default app;
