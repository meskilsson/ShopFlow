export type UserRole = "buyer" | "seller" | "admin";

export type AuthTokenPayload = {
  id: string;
  email?: string;
  username?: string;
  role?: UserRole;
};

interface PublicUser {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
}
