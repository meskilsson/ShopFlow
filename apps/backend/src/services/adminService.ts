import { ForbiddenError, NotFoundError, ValidationError } from "../errors/AppError";
import Product from "../models/Products";
import User from "../models/User";
import Order from "../models/Order";
import { DeleteAdminUserByIdInput, RestoreAdminUserByIdInput, DeleteAdminProductByIdInput, RestoreProductUserByIdInput } from "../types/admin.types";
import { Types } from "mongoose";
import type { GetAdminUsersOptions, AdminUserFilter, GetAdminProducts, ProductFilterOptions, OrderFilterOptions, GetAdminOrders } from "../types/admin.types";


export async function getAdminUsers({
    page,
    limit,
    role,
    search,
    includeDeleted,
}: GetAdminUsersOptions) {

    const skip = (page - 1) * limit;

    const filter: AdminUserFilter = {};

    if (!includeDeleted) {
        filter.deletedAt = null;
    }


    if (role) {
        filter.role = role;
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
        ];
    }


    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);
    const count = users.length;

    return {
        success: true,
        page,
        limit,
        count,
        totalUsers,
        totalPages,
        users,
    };
}

export async function getAdminUserById(id: string) {

    const user = await User.findById(id);

    if (!user) {
        throw new NotFoundError("Could not find user");
    }


    return user;

}

export async function deleteAdminUserById({
    targetUserId,
    adminUserId,
    deleteReason,
}: DeleteAdminUserByIdInput) {

    const user = await User.findById(targetUserId);

    if (!user) {
        throw new NotFoundError("Could not find user");
    }

    if (user.deletedAt) {
        throw new ValidationError("User is already deleted");
    }

    if (user.id === adminUserId) {
        throw new ForbiddenError("You cannot delete your own admin account");
    }


    if (user.role === "admin") {
        const activeAdminCount = await User.countDocuments({
            role: "admin",
            deletedAt: null,
        });

        if (activeAdminCount <= 1) {
            throw new ForbiddenError("You cannot delete the last active admin");
        }
    }

    user.deletedAt = new Date();
    user.deletedBy = new Types.ObjectId(adminUserId);
    user.deleteReason = deleteReason ?? null;

    await user.save();

    return user;
}


export async function restoreAdminUserById({
    targetUserId,
}: RestoreAdminUserByIdInput) {

    const user = await User.findById(targetUserId);

    if (!user) {
        throw new NotFoundError("User could not be found");
    }

    if (!user.deletedAt) {
        throw new ValidationError("User is not deleted");
    }

    user.deletedAt = null;
    user.deletedBy = null;
    user.deleteReason = null;


    await user.save();

    return user;
}



export async function getAdminProducts({ page, limit, search, category, includeDeleted }: GetAdminProducts) {

    const skip = (page - 1) * limit;
    const filter: ProductFilterOptions = {};

    if (!includeDeleted) {
        filter.deletedAt = null;
    }

    if (category) {
        filter.category = category;
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
        ];
    }


    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);


    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const count = products.length;




    return {
        success: true,
        products,
        page,
        limit,
        totalProducts,
        totalPages,
        count
    };
}

export async function getAdminProductById(id: string) {

    const product = await Product.findById(id);

    if (!product) {
        throw new NotFoundError("Could not find product");
    }

    return product;
}

export async function deleteAdminProductById({
    targetProductId,
    adminUserId,
    deleteReason,
}: DeleteAdminProductByIdInput) {

    const product = await Product.findById(targetProductId);

    if (!product) {
        throw new NotFoundError("Could not find product");
    }

    if (product.deletedAt) {
        throw new ValidationError("Product is already deleted");
    }

    product.deletedAt = new Date();
    product.deletedBy = new Types.ObjectId(adminUserId);
    product.deleteReason = deleteReason ?? null;

    await product.save();

    return product;

}


export async function restoreAdminProductById({
    targetProductId,
}: RestoreProductUserByIdInput) {

    const product = await Product.findById(targetProductId);

    if (!product) {
        throw new NotFoundError("Could not find product");
    }

    if (!product.deletedAt) {
        throw new ValidationError("Product is not deleted");
    }

    product.deletedAt = null;
    product.deletedBy = null;
    product.deleteReason = null;


    await product.save();

    return product;
}

export async function getAdminOrders({ page, limit, search, status, paymentStatus, includeDeleted }: GetAdminOrders) {

    const skip = (page - 1) * limit;

    const filter: OrderFilterOptions = {};

    if (!includeDeleted) {
        filter.deletedAt = null;
    }

    if (status) {
        filter.status = status;
    }

    if (paymentStatus) {
        filter.paymentStatus = paymentStatus;
    }


    if (search) {
        const searchConditions: OrderFilterOptions["$or"] = [
            {
                sessionId: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];

        if (Types.ObjectId.isValid(search)) {
            const objectId = new Types.ObjectId(search);

            searchConditions.push(
                { _id: objectId },
                { user: objectId },
            );
        }

        filter.$or = searchConditions;
    }



    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "name email username role");


    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);
    const count = orders.length;

    return {
        success: true,
        page,
        limit,
        count,
        totalOrders,
        totalPages,
        orders,
    }

}