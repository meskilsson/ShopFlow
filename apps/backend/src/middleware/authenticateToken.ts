import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export default function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: "No token in cookie" });
        return;
    }

    try {
        const payload = verifyAccessToken(token);

        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };

        next();
    } catch {
        res.status(403).json({ error: "Unauthorized or expired token" });
    }
}