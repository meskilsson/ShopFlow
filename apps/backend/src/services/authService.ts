import User from "../models/User";
import bcrypt from "bcrypt";
import { UnauthorizedError, ValidationError } from "../errors/AppError";

interface LoginUserInput {
  email: string;
  password: string;
}

export async function loginUser(loginData: LoginUserInput) {
  if (!loginData?.email || !loginData?.password) {
    throw new ValidationError("Email and password are required");
  }

  const email = loginData.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    loginData.password,
    user.passwordHash,
  );

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const safeUser = await User.findById(user._id);

  return {
    user: safeUser,
  };
}
