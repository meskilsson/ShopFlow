import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import {
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/AppError";
import type { UserRole } from "../types/authTypes";

export function requireOrderOwnerOrRole(...allowedRoles: UserRole[]) {
    return async (
        req: Request,
        _res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Authentication required");
            }

            const order = await Order.findById(req.params.id);

            if (!order) {
                throw new NotFoundError("Order not found");
            }

            const isOwner =
                req.user.role === "buyer" &&
                order.user?.toString() === req.user.id;

            const hasAllowedRole = allowedRoles.includes(req.user.role);

            if (!isOwner && !hasAllowedRole) {
                throw new ForbiddenError("Forbidden");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}