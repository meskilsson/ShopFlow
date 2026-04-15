export type UserRole = "buyer" | "seller" | "admin";

export type AuthTokenPayload = {
    userId: string;
    email: string;
    username: string;
    role: UserRole;
};