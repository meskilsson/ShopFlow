import User from "../models/User";
import { UserRole } from "../types/authTypes";


interface GetAdminUsersOptions {
    page: number;
    limit: number;
    role?: UserRole;
}



export async function getAdminUsers({ page, limit, role }: GetAdminUsersOptions) {

    const skip = (page - 1) * limit;

    const filter: {
        deletedAt: null,
        role?: UserRole;
    } = {
        deletedAt: null,
    };


    if (role) {
        filter.role = role;
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);


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
        users
    }
}