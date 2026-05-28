import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError, ForbiddenError, UnauthorizedError } from "../errors/AppError";
import User from "../models/User";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    if (user.deletedAt) {
      throw new ForbiddenError("Account is disabled");
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new UnauthorizedError("Invalid or expired token"));
  }
}