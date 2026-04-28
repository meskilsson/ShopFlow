import User, { UserRole } from "../models/User";
import bcrypt from "bcrypt";
import { createHttpError } from "../middleware/HttpError";


interface CreateUserInput {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
}

interface UpdatedUserInput {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: UserRole;
}

export async function createUser(userData: CreateUserInput) {
  if (!userData?.name || !userData?.email || !userData?.username || !userData?.password) {
    throw createHttpError("Name, email, username and password are required", 400);

  }

  const name = userData.name.trim();
  const email = userData.email.trim().toLowerCase();
  const username = userData.username.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw createHttpError("Email or username already in use", 409);
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const createdUser = await User.create({
    name,
    email,
    username,
    passwordHash,
    ...(userData.role && { role: userData.role }),
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
    throw createHttpError("User not found", 404);
  }
  return user;
}

export async function deleteUser(id: string) {
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw createHttpError("User not found", 404);
  }

  return { message: "User deleted successfully" };
}

export async function updateUser(id: string, userData: UpdatedUserInput) {

  const user = await User.findById(id);

  if (!user) {
    throw createHttpError("User not found", 404);
  }

  const updateData: {
    name?: string;
    email?: string;
    username?: string;
    passwordHash?: string;
    role?: UserRole;
  } = {};

  if (userData.name !== undefined) {
    const name = userData.name.trim();

    if (!name) {
      throw createHttpError("Name cannot be empty", 400);
    }

    updateData.name = name;
  }

  if (userData.email !== undefined) {
    const email = userData.email.trim().toLowerCase();

    if (!email) {
      throw createHttpError("Email cannot be empty", 400);
    }

    updateData.email = email;
  }

  if (userData.username !== undefined) {
    const username = userData.username.trim().toLowerCase();

    if (!username) {
      throw createHttpError("Username cannot be empty", 400);
    }

    updateData.username = username;
  }

  if (userData.role !== undefined) {
    updateData.role = userData.role;
  }

  if (userData.password !== undefined) {
    if (!userData.password) {
      throw createHttpError("Passwod cannot be empty", 400);
    }

    updateData.passwordHash = await bcrypt.hash(userData.password, 10);
  }

  const conflictConditions = [];

  if (updateData.email) {
    conflictConditions.push({ email: updateData.email });
  }

  if (updateData.username) {
    conflictConditions.push({ username: updateData.username });
  }

  if (conflictConditions.length > 0) {
    const existingUser = await User.findOne({
      _id: { $ne: id },
      $or: conflictConditions,
    });

    if (existingUser) {
      throw createHttpError("Email or username already in use", 409);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedUser;

}
