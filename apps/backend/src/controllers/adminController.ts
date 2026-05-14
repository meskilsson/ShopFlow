import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminService";
import { ValidationError } from "../errors/AppError";
import type { UserRole } from "../models/User";
import { userIdParamsSchema, type UserIdParams } from "../schemas/userSchemas";
import { SoftDeleteUserBody } from "../schemas/admin.schemas";


export async function getAdminUsers(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);

        const rawRole = req.query.role;
        const rawSearch = req.query.search;
        const rawIncludeDeleted = req.query.includeDeleted;

        let role: UserRole | undefined;
        let search: string | undefined;
        let includeDeleted = false;

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

        if (rawSearch !== undefined) {
            if (typeof rawSearch !== "string") {
                throw new ValidationError("Search must be a string");
            }

            const trimmedSearch = rawSearch.trim();

            if (trimmedSearch.length > 0) {
                search = trimmedSearch;
            }
        }

        if (rawIncludeDeleted !== undefined) {
            if (typeof rawIncludeDeleted !== "string") {
                throw new ValidationError("includeDeleted must be a string");
            }

            if (
                rawIncludeDeleted !== "true" &&
                rawIncludeDeleted !== "false"
            ) {
                throw new ValidationError(
                    "includeDeleted must be true or false",
                );
            }

            includeDeleted = rawIncludeDeleted === "true";
        }

        const options: {
            page: number;
            limit: number;
            role?: UserRole;
            search?: string;
            includeDeleted: boolean;
        } = {
            page,
            limit,
            includeDeleted,
        };

        if (role !== undefined) {
            options.role = role;
        }

        if (search !== undefined) {
            options.search = search;
        }

        const result = await adminService.getAdminUsers(options);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getAdminUserById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        const params = req.validatedParams as UserIdParams;

        const user = await adminService.getAdminUserById(params.id);

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        next(error);
    }
}

export async function deleteAdminUserById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        const params = req.validatedParams as UserIdParams;
        const body = req.validatedBody as SoftDeleteUserBody;

        const user = await adminService.deleteAdminUserById({
            targetUserId: params.id,
            adminUserId: req.user!.id,
            deleteReason: body.deleteReason,
        });

        res.status(200).json({
            success: true,
            message: "User soft-deleted successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
}

export async function restoreAdminUserById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        const params = req.validatedParams as UserIdParams;


        const user = await adminService.restoreAdminUserById({ targetUserId: params.id });


        res.status(200).json({
            success: true,
            message: "User restored successfully",
            user,
        });

    } catch (error) {
        next(error);
    }
}