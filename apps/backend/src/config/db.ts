import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: process.env.DB_NAME,
    });

    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
