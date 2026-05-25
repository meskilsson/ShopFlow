import type { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";

export function requireSelfOrAdmin(
    req: Request,
    _res: Response,
    next: NextFunction,
): void {
    if (!req.user) {
        throw new UnauthorizedError("Authorization is required");
    }

    if (req.user.role === "admin") {
        next();
        return;
    }

    if (req.user.id === req.params.id) {
        next();
        return;
    }

    throw new ForbiddenError("You are not allowed to access this user");
}