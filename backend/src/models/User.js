import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    emailVerification: { type: Boolean, default: false },
    passwordVerification: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: [
      {
        tokenHash: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
      },
    ],
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);


userSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.createdAt) ret.createdAt = ret.createdAt.toLocaleString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toLocaleString();
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;