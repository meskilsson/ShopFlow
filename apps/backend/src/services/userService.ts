import User from "../models/User";
import bcrypt from "bcrypt";

interface CreateUserInput {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: "buyer" | "seller";
}

export async function createUser(userData: CreateUserInput) {
  if (!userData?.name || !userData?.email || !userData?.username || !userData?.password) {
    const error = new Error("Name, email, username, and password are required") as Error & {
      statusCode?: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const name = userData.name.trim();
  const email = userData.email.trim().toLowerCase();
  const username = userData.username.trim().toLowerCase();
  const role = userData.role?.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const error = new Error("Email or username already in use") as Error & {
      statusCode?: number;
    };
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const createdUser = await User.create({
    name,
    email,
    username,
    passwordHash,
    role,
  });

  const safeUser = await User.findById(createdUser._id);

  return safeUser;
}

export async function getAllUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users;
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
