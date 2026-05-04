import mongoose from "mongoose";
import CartItem from "../models/CartItem";

export async function connectDB(): Promise<void> {
  try {
    const dbName = process.env.DB_NAME;

    await mongoose.connect(process.env.MONGODB_URI as string, {
      ...(dbName ? { dbName } : {}),
    });

    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
