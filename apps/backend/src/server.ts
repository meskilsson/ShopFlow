import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import dotenv from "dotenv";
dotenv.config();

import { Response, Request } from "express";

import express from "express";
import cors from "cors";
import logger from "./middleware/logger";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());
app.use(logger);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.send("ShopFlow backend is running");
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 */
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
