import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/User.js";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@liquorstore.com";
    const plainPassword = "Admin@12345";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    await User.create({
      name: "Admin",
      email,
      passwordHash,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", plainPassword);
    process.exit(0);
  } catch (err) {
    console.error(" Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
