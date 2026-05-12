import User from "../models/User";
import bcrypt from "bcrypt";
import { ValidationError, ConflictError, NotFoundError } from "../errors/AppError";
import type { UpdateUserInput, CreateUserInput } from "../schemas/userSchemas";





export async function createUser(userData: CreateUserInput) {
  if (!userData?.name || !userData?.email || !userData?.username || !userData?.password) {
    throw new ValidationError("Name, email, username and password are required");

  }

  const name = userData.name.trim();
  const email = userData.email.trim().toLowerCase();
  const username = userData.username.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ConflictError("Email or username already in use");
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const createdUser = await User.create({
    name,
    email,
    username,
    passwordHash,
    ...(userData.role && { role: userData.role }),
  });

  const safeUser = await User.findOne({ email });

  return safeUser;
}

export async function getAllUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users;
}

export async function getUserById(id: string) {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function deleteUser(id: string) {
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return { message: "User deleted successfully" };
}

export async function updateUser(id: string, userData: UpdateUserInput) {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updateData: {
    name?: string;
    email?: string;
    username?: string;
  } = {};

  if (userData.name !== undefined) {
    updateData.name = userData.name;
  }

  if (userData.email !== undefined) {
    updateData.email = userData.email;
  }

  if (userData.username !== undefined) {
    updateData.username = userData.username;
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
      throw new ConflictError("Email or username already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
}

export async function changePasswordService(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new ValidationError("Current password is incorrect");
  }

  if (!newPassword) {
    throw new ValidationError("New password cannot be empty");
  }

  if (newPassword.length < 6) {
    throw new ValidationError("New password must be at least 6 characters");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);

  await user.save();

  return {
    message: "Password updated successfully",
  };
}