import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/authTypes";

export function authorizeRoles(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.user?.role;

        if (!userRole) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        next();
    };
}