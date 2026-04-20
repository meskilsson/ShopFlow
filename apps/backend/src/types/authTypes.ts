export type UserRole = "buyer" | "seller" | "admin";

export type AuthTokenPayload = {
    userId: string;
    email: string;
    username: string;
    role: UserRole;
};


interface PublicUser {
    _id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
}