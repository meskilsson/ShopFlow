import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";
import type { UserRole } from "../types/authTypes";

export function requireSelfOrRole(
    paramName: string,
    ...allowedRoles: UserRole[]
) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new UnauthorizedError("Authentication required"));
            return;
        }

        const targetUserId = req.params[paramName];

        const isSelf = req.user.id === targetUserId;
        const hasAllowedRole = allowedRoles.includes(req.user.role);

        if (!isSelf && !hasAllowedRole) {
            next(new ForbiddenError("Forbidden"));
            return;
        }

        next();
    };
}