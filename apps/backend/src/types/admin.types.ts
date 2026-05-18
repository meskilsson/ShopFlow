import { UserRole } from "./authTypes";
import { ProductCategory } from "../models/Products";
import { Types } from "mongoose";

export interface DeleteAdminUserByIdInput {
    targetUserId: string;
    adminUserId: string;
    deleteReason?: string | undefined;
}

export interface RestoreAdminUserByIdInput {
    targetUserId: string;
}

export interface GetAdminUsersOptions {
    page: number;
    limit: number;
    role?: UserRole;
    search?: string;
    includeDeleted: boolean;
}

export type AdminUserFilter = {
    deletedAt?: null;
    role?: UserRole;
    $or?: Array<{
        name?: { $regex: string; $options: "i" };
        email?: { $regex: string; $options: "i" };
        username?: { $regex: string; $options: "i" };
    }>;
};



export type ProductFilterOptions = {
    deletedAt?: null;
    category?: ProductCategory;
    $or?: Array<{
        name?: { $regex: string; $options: "i" };
        category?: { $regex: string; $options: "i" };
    }>;
};

export interface GetAdminProducts {
    page: number;
    limit: number;
    search?: string;
    category?: ProductCategory;
    includeDeleted: boolean;
}

export type DeleteAdminProductByIdInput = {
    targetProductId: string;
    adminUserId: string;
    deleteReason: string;
}


export interface RestoreProductUserByIdInput {
    targetProductId: string;
}

export type ProductIdParams = {
    id: string;
}

export type RestoreAdminProductByIdInput = {
    targetProductId: string;
    adminUserId: string;
    deleteReason: string;
}

export interface GetAdminOrders {
    page: number;
    limit: number;
    search?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    includeDeleted: boolean;
}

export type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

export type PaymentStatus =
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

export type OrderFilterOptions = {
    deletedAt?: null;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    user?: Types.ObjectId | { $in: Types.ObjectId[] };
    sessionId?: { $regex: string; $options: "i" };
    _id?: Types.ObjectId;
    $or?: Array<{
        _id?: Types.ObjectId;
        user?: Types.ObjectId;
        sessionId?: { $regex: string; $options: "i" };
        status?: OrderStatus;
        paymentStatus?: PaymentStatus;
    }>;
};

export type DeleteAdminOrderByIdInput = {
    targetOrderId: string;
    adminUserId: string;
    deleteReason: string;
}

export type RestoreAdminOrderByIdInput = {
    targetOrderId: string;
}