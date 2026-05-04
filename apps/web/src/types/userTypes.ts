type UserRoles = "buyer" | "seller" | "admin";

export type User = {
    _id: string;
    name: string;
    email: string;
    username: string;
    role: UserRoles;
}

export type CreateUserData = {
    name: string;
    email: string;
    username: string;
    password: string;
    role?: UserRoles;
};

export type UpdateUserData = {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    role?: UserRoles;
};