import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({ message: "Admin not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const protectUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.role !== "user") {
      return res.status(403).json({ message: "User access only" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export function createEmailVerifyToken(userId) {
    return jwt.sign(
        { userId, type: "email_verify" },
        process.env.EMAIL_VERIFY_JWT_SECRET,
        { expiresIn: "24h" }
    );
}

export function verifyEmailVerifyToken(token) {
    return jwt.verify(token, process.env.EMAIL_VERIFY_JWT_SECRET);
}

export function createPasswordVerifyToken(userId) {
    return jwt.sign(
        { userId, type: "password_reset" },
        process.env.PASSWORD_RESET_JWT_SECRET,
        { expiresIn: "15m" }
    );
}

export function verifyPasswordVerifyToken(token) {
    return jwt.verify(token, process.env.PASSWORD_RESET_JWT_SECRET);
}