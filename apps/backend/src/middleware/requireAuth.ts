import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ForbiddenError } from "../errors/AppError";
import User from "../models/User";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = verifyAccessToken(token);




    const user = await User.findById(decoded.id);


    if (!user) {
      throw new ForbiddenError("Forbidden");
    }

    if (user.deletedAt) {
      throw new ForbiddenError("Forbidden");
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };


    next();
  } catch (error) {
    throw new ForbiddenError("Unauthorized or expired token");
  }
}
