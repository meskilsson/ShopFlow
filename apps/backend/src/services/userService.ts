import User, { IUser } from "../models/User";

export async function createUser(userData: IUser) {
  return await User.create(userData);
}

export async function getAllUsers() {
  return await User.find().sort({ createdAt: -1 });
}

export async function getUserById(id: string) {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("User not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return user;
}
