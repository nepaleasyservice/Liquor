import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyEmailVerifyToken } from "../middleware/authMiddleware.js";

const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "You are not a user" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Incorrect Password" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admin_token", token, adminCookieOptions);

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");

    let payload;
    try {
      payload = verifyEmailVerifyToken(token);
    } catch (e) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&reason=expired`);
    }

    if (payload?.type !== "email_verify" || !payload?.userId) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&reason=invalid`);
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&reason=notfound`);
    }

    if (user.emailVerification) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=already`);
    }

    user.emailVerification = true;
    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&reason=server`);
  }
};
