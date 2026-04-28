import mongoose from "mongoose";

export async function connectDB(): Promise<void> {

  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }
  if (!dbName) {
    throw new Error("DB_NAME is missing in environment variables");
  }

  try {
    await mongoose.connect(mongoUri, {
      ...(dbName ? { dbName } : {}),
    });

    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
