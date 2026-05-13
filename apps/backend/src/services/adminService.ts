import User, { type IUser, type UserRole } from "../models/User";

interface GetAdminUsersOptions {
    page: number;
    limit: number;
    role?: UserRole;
    search?: string;
}

type AdminUserFilter = {
    deletedAt: null;
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
}: GetAdminUsersOptions) {
    const skip = (page - 1) * limit;

    const filter: AdminUserFilter = {
        deletedAt: null,
    };

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