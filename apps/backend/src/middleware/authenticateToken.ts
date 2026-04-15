import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "../types/authTypes";

const JWT_SECRET = process.env.JWT_SECRET || "server_jwt_token";

export default function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        res.status(401).json({ error: "No token in header" });
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
        req.user = payload;
        next();
    } catch {
        res.status(403).json({ error: "Unauthorized or expired token" });
    }
}
