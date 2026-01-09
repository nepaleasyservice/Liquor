import { sendEmail } from "../utils/emailService.js";

export function emailMiddleware(req, res, next){
    req.sendEmail = sendEmail;
    next();
}