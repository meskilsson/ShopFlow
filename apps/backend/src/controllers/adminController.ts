import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminService";
import { ValidationError } from "../errors/AppError";
import type { UserRole } from "../models/User";

export async function getAdminUsers(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);

        const rawRole = req.query.role;
        let role: UserRole | undefined;

        if (Number.isNaN(limit) || limit < 1) {
            limit = 10;
        }

        if (limit > 100) {
            limit = 100;
        }

        if (Number.isNaN(page) || page < 1) {
            page = 1;
        }

        if (rawRole !== undefined) {
            if (typeof rawRole !== "string") {
                throw new ValidationError("Role must be a string");
            }

            if (
                rawRole !== "buyer" &&
                rawRole !== "seller" &&
                rawRole !== "admin"
            ) {
                throw new ValidationError("Invalid role");
            }

            role = rawRole;
        }

        const options: {
            page: number;
            limit: number;
            role?: UserRole;
        } = {
            page,
            limit,
        };

        if (role !== undefined) {
            options.role = role;
        }

        const result = await adminService.getAdminUsers(options);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}