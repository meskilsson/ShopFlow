import { ForbiddenError, NotFoundError, ValidationError } from "../errors/AppError";
import User, { type IUser, type UserRole } from "../models/User";
import { DeleteAdminUserByIdInput, RestoreAdminUserByIdInput } from "../types/admin.types";
import { Types } from "mongoose";

interface GetAdminUsersOptions {
    page: number;
    limit: number;
    role?: UserRole;
    search?: string;
    includeDeleted: boolean;
}

type AdminUserFilter = {
    deletedAt?: null;
    role?: UserRole;
    $or?: Array<{
        name?: { $regex: string; $options: "i" };
        email?: { $regex: string; $options: "i" };
        username?: { $regex: string; $options: "i" };
    }>;
};

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