import { jwt } from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN_DAYS = 30;

export function signAccessToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role,
            tokenVersion: user.tokenVersion ?? 0,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: ACCESS_EXPIRES_IN,
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWY_AUDIENCE,
            algorithm: "HS256",
        }
    );
}

export function signRefreshToken(user, jti) {
    return jwt.sign(
        {
            id: user._id.toString(),
            jti,
            tokenVersion: user.tokenVersion ?? 0,
            type: "refresh",
        },
        process.env.REFRESH_JWT_SECRET,
        {
            expiresIn: `${REFRESH_EXPIRES_IN_DAYS}d`,
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWY_AUDIENCE,
            algorithm: "HS256"
        }
    );
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWY_AUDIENCE,
    });
}

export function randomJti(){
    return crypto.randomBytes(16).toString("hex");
}

export function sha256(input){
    return crypto.createHash("sha256").update(input).digest("hex");
}

export function refreshExpiryDate(){
    const d = new Date();
    d.setDate(d.getDate() + REFRESH_EXPIRES_IN_DAYS);
    return d;
}