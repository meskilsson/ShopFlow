import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Unauthorized or expired token" });
  }
}
