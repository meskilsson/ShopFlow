import { Request, Response, NextFunction } from "express";
import Product from "../models/Products";
import {
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/AppError";
import type { UserRole } from "../types/authTypes";

export function requireProductOwnerOrRole(...allowedRoles: UserRole[]) {
    return async (
        req: Request,
        _res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Authentication required");
            }

            const product = await Product.findById(req.params.id);

            if (!product) {
                throw new NotFoundError("Product not found");
            }

            const isOwner =
                req.user.role === "seller" &&
                product.seller?.toString() === req.user.id;

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