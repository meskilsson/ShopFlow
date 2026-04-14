import User from "../models/User";
import bcrypt from 'bcrypt';

interface LoginUserInput {
    email: string;
    password: string;
};

export async function loginUser(loginData: LoginUserInput) {
    if (!loginData?.email || !loginData?.password) {
        const error = new Error("Email and password are required") as Error & {
            statusCode?: number;
        }

        error.statusCode = 400;
        throw error;
    }

    const email = loginData.email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
        const error = new Error("Invalid email or password") as Error & {
            statusCode?: number;
        }

        error.statusCode = 401;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
        loginData.password,
        user.passwordHash,
    );

    if (!isPasswordCorrect) {
        const error = new Error("Invalid email or password") as Error & {
            statusCode?: number;
        };
        error.statusCode = 401;
        throw error;
    }

    const safeUser = await User.findById(user._id);

    return safeUser;
}