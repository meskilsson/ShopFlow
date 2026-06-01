import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminService";
import { ValidationError } from "../errors/AppError";
import type { UserRole } from "../models/User";
import type { UserIdParams } from "../schemas/userSchemas";
import { SoftDeleteUserBody } from "../schemas/admin.schemas";
import { Types } from "mongoose";

import { ProductCategory } from "../models/Products";
import { OrderStatus, PaymentStatus } from "../types/admin.types";


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

const productCategories: ProductCategory[] = [
    "T-shirts",
    "Shoes",
    "Pants",
    "Shirts",
    "Jackets",
    "Accessories",
];

export async function getAdminProducts(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        let page = Number(req.query.page);
        let limit = Number(req.query.limit);

        const rawCategory = req.query.category;
        const rawSearch = req.query.search;
        const rawIncludeDeleted = req.query.includeDeleted;

        let search: string | undefined;
        let category: ProductCategory | undefined;
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

        if (rawSearch !== undefined) {
            if (typeof rawSearch !== "string") {
                throw new ValidationError("Search must be a string");
            }

            const trimmedSearch = rawSearch.trim();

            if (trimmedSearch.length > 0) {
                search = trimmedSearch;
            }
        }

        if (rawCategory !== undefined) {
            if (typeof rawCategory !== "string") {
                throw new ValidationError("Category must be a string");
            }

            const trimmedCategory = rawCategory.trim();

            if (!productCategories.includes(trimmedCategory as ProductCategory)) {
                throw new ValidationError("Invalid category");
            }

            category = trimmedCategory as ProductCategory;
        }

        if (rawIncludeDeleted !== undefined) {
            if (typeof rawIncludeDeleted !== "string") {
                throw new ValidationError("includeDeleted must be a string");
            }

            if (rawIncludeDeleted !== "true" && rawIncludeDeleted !== "false") {
                throw new ValidationError("includeDeleted must be true or false");
            }

            includeDeleted = rawIncludeDeleted === "true";
        }



        const options: {
            page: number;
            limit: number;
            search?: string;
            category?: ProductCategory;
            includeDeleted: boolean;
        } = {
            page,
            limit,
            includeDeleted,
        };

        if (search !== undefined) {
            options.search = search;
        }

        if (category !== undefined) {
            options.category = category;
        }

        const result = await adminService.getAdminProducts(options);

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

export async function getAdminProductById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        const params = req.validatedParams as UserIdParams;

        const product = await adminService.getAdminProductById(params.id)

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error)
    }
}

export async function deleteAdminProductById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {




        // const params = req.validatedParams as ProductIdParams;
        // const body = req.validatedBody as RestoreAdminProductByIdInput;


        // Placeholder tills zod schema har gjorts på product. 

        const { id } = req.params;
        const body = req.body;

        if (!id) {
            throw new ValidationError("Product id is required");
        }

        if (Array.isArray(id)) {
            throw new ValidationError("Invalid product id");
        }

        if (!Types.ObjectId.isValid(id)) {
            throw new ValidationError("Invalid product id");
        }

        if (
            body.deleteReason !== undefined &&
            typeof body.deleteReason !== "string"
        ) {
            throw new ValidationError("deleteReason must be a string");
        }

        const deleteReason = body.deleteReason?.trim();

        // PLACEHOLDER


        //deleteReason ska ersättas med deleteReason: body.deleteReason,

        const product = await adminService.deleteAdminProductById({
            targetProductId: id,
            adminUserId: req.user!.id,
            deleteReason,
        });

        res.status(200).json({
            success: true,
            message: "Product successfully soft-deleted",
            product,
        });

    } catch (error) {
        next(error)
    }
}

export async function restoreAdminProductById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        // const params = req.validatedParams as ProductIdParams;
        // const product = await adminService.restoreAdminProductById({ targetProductId: params.id });


        // Placeholder tills zod schema har gjorts på product.

        const { id } = req.params

        if (!id) {
            throw new ValidationError("Product id is required");
        }

        if (Array.isArray(id)) {
            throw new ValidationError("Invalid product id");
        }

        if (!Types.ObjectId.isValid(id)) {
            throw new ValidationError("Invalid product id");
        }

        // PLACEHOLDER

        const product = await adminService.restoreAdminProductById({ targetProductId: id });



        res.status(200).json({
            success: true,
            message: "Product restored successfully",
            product,
        });
    } catch (error) {
        next(error);
    }
}


const orderStatuses: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const paymentStatuses: PaymentStatus[] = [
    "pending",
    "paid",
    "failed",
    "refunded",
];

export async function getAdminOrders(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        let search: string | undefined;
        let includeDeleted = false;
        let status: OrderStatus | undefined;
        let paymentStatus: PaymentStatus | undefined;

        const rawSearch = req.query.search;
        const rawIncludeDeleted = req.query.includeDeleted;
        const rawStatus = req.query.status;
        const rawPaymentStatus = req.query.paymentStatus;

        if (Number.isNaN(limit) || limit < 1) {
            limit = 10;
        }

        if (limit > 100) {
            limit = 100;
        }

        if (Number.isNaN(page) || page < 1) {
            page = 1;
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

            if (rawIncludeDeleted !== "true" &&
                rawIncludeDeleted !== "false"
            ) {
                throw new ValidationError("includeDeleted must be true or false");
            }

            includeDeleted = rawIncludeDeleted === "true";
        }

        if (rawStatus !== undefined) {
            if (typeof rawStatus !== "string") {
                throw new ValidationError("status must be a string");
            }

            if (!orderStatuses.includes(rawStatus as OrderStatus)) {
                throw new ValidationError("Invalid order status");
            }

            status = rawStatus as OrderStatus;
        }

        if (rawPaymentStatus !== undefined) {
            if (typeof rawPaymentStatus !== "string") {
                throw new ValidationError("Payment status must be a string");
            }

            if (!paymentStatuses.includes(rawPaymentStatus as PaymentStatus)) {
                throw new ValidationError("Invalid payment status");
            }

            paymentStatus = rawPaymentStatus as PaymentStatus;
        }



        const options: {
            page: number;
            limit: number;
            search?: string;
            status?: OrderStatus;
            paymentStatus?: PaymentStatus;
            includeDeleted: boolean;
        } = {
            page,
            limit,
            includeDeleted,
        };

        if (search !== undefined) {
            options.search = search;
        }

        if (status !== undefined) {
            options.status = status;
        }

        if (paymentStatus !== undefined) {
            options.paymentStatus = paymentStatus;
        }


        const result = await adminService.getAdminOrders(options);

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

export async function getAdminOrderById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {


        // Uppdatera när zod validering är gjord
        // const params = req.validatedParams as OrderIdParams;
        // const result = await adminService.getAdminOrderById(params.id);

        const { id } = req.params;

        if (!id) {
            throw new ValidationError("Order id is required");
        }

        if (Array.isArray(id)) {
            throw new ValidationError("Invalid order id");
        }

        if (!Types.ObjectId.isValid(id)) {
            throw new ValidationError("Invalid order id");
        }

        const result = await adminService.getAdminOrderById(id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteAdminOrderById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        const { id } = req.params;
        const body = req.body;

        if (!id) {
            throw new ValidationError("Order id is required");
        }

        if (Array.isArray(id)) {
            throw new ValidationError("Invalid order id");
        }

        if (!Types.ObjectId.isValid(id)) {
            throw new ValidationError("Invalid order id");
        }

        if (
            body.deleteReason !== undefined &&
            typeof body.deleteReason !== "string"
        ) {
            throw new ValidationError("deleteReason must be a string");
        }

        const deleteReason = body.deleteReason?.trim();

        // PLACEHOLDER


        // TODO: deleteReason ska ersättas med deleteReason: body.deleteReason,

        const order = await adminService.deleteAdminOrderById({
            targetOrderId: id,
            adminUserId: req.user!.id,
            deleteReason,
        });


        res.status(200).json({
            success: true,
            message: "Order successfully soft-deleted",
            order,
        });

    } catch (error) {
        next(error);
    }
}

export async function restoreAdminOrderById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {

        const { id } = req.params;

        if (!id) {
            throw new ValidationError("Order id is required");
        }

        if (Array.isArray(id)) {
            throw new ValidationError("Invalid order id");
        }

        if (!Types.ObjectId.isValid(id)) {
            throw new ValidationError("Invalid order id");
        }

        const order = await adminService.restoreAdminOrderById({
            targetOrderId: id,
        })



        res.status(200).json({
            success: true,
            message: "Order successfully restored",
            order,
        });

    } catch (error) {
        next(error);
    }
}