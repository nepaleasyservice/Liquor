import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createEmailVerifyToken,
  createPasswordVerifyToken,
  verifyPasswordVerifyToken,
} from "../middleware/authMiddleware.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = (email || "").toLowerCase().trim();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
    });

    const token = createEmailVerifyToken(user._id);
    const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

    try {
      await req.sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
          <h2>Hello ${user.name || ""}</h2>
          <p>Please verify your email by clicking this link:</p>
          <p><a href="${verifyLink}">Verify Email</a></p>
          <p>This link expires in 24 hours.</p>
        `,
        text: `Verify your email: ${verifyLink}`,
      });
    } catch (e) {
      console.log("Verification email failed:", e?.message);
      return res.status(400).json({ message: "Verification email failed" });
    }

    return res.status(201).json({
      message: "Signup successful. Please check your email to verify",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isDisabled) return res.status(400).json({ message: "Your account is disabled" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Password didn't match" });

    if (!user.emailVerification) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    console.log(req.body);
    const email = (req.body?.email || "").toLowerCase().trim();
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists for this email, we have sent a password reset link.",
      });
    }

    const token = createPasswordVerifyToken(user._id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await req.sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Hello ${user.name || ""},</h2>
          <p>We received a request to reset your LiquorStore password.</p>
          <p>Click the button below to reset your password. This link expires in <b>15 minutes</b>.</p>

          <p style="margin: 24px 0;">
            <a href="${resetLink}"
              style="background:#D4A056; color:#000; padding:12px 18px; border-radius:10px; text-decoration:none; font-weight:bold;">
              Reset Password
            </a>
          </p>

          <p>If you didn’t request a password reset, you can safely ignore this email.</p>

          <p style="color:#666; font-size:12px; margin-top:24px">
            If the button doesn’t work, copy and paste this link into your browser:<br/>
            <a href="${resetLink}">${resetLink}</a>
          </p>
        </div>
      `,
      text: `Reset your LiquorStore password: ${resetLink}
If you didn’t request this, ignore this email.`,
    });

    return res.status(200).json({
      message:
        "If an account exists for this email, we have sent a password reset link.",
    });
  } catch (err) {
    console.log("forgotPassword error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = req.body?.token;
    const password = req.body?.password;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required." });
    }

    let decoded;
    try {
      decoded = verifyPasswordVerifyToken(token);
    } catch (e) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (decoded?.type !== "password_reset") {
      return res.status(400).json({ message: "Invalid token type." });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: "User not found." });

    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();

    return res
      .status(200)
      .json({ message: "Password reset successful. You can login now." });
  } catch (err) {
    console.log("resetPassword error:", err.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.json({ message: "Logged out" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}