import dotenv from "dotenv";
dotenv.config();

import { Response, Request } from "express";
import mongoose from 'mongoose';

import express from "express";
import cors from "cors";
import logger from "./middleware/logger";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import userRouter from "./routes/userRoutes";
import { connectDB } from "./config/db";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ---------------------- mongoose ---------------------- //
mongoose.connect('mongodb://127.0.0.1:27017/ShopFlow')
.then(() => console.log('Ansluten till MongoDB'))
.catch(err => console.log('Fel vid anslutningen:' , err));

// ----- Detta ska flyttas till ' Product.ts (?) ' ---- //
  const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    category: String,
    inStock: Boolean
});

const Product = mongoose.model('Product', productSchema);

// ---------------------------------------------------- //

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());
app.use(logger);

app.get("/", (_req, res) => {
  res.send("ShopFlow backend is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/v1/users", userRouter);

app.use(notFound);
app.use(errorHandler);




app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
async function startServer(): Promise<void> {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
}

startServer();
