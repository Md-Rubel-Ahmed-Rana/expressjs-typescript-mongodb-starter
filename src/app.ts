import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { RootRoutes } from "./routes/root.routes";
import apiRateLimiter from "./config/apiRateLimiter";
import { logger } from "./config/logger";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { swaggerSpec } from "./config/apiDoc.swagger";
import handleZodValidationError from "./errors/validationError";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
// app.use(apiRateLimiter.limitAPIRequest());

// application routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", RootRoutes);

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../public", "index.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      logger.error(`Error reading HTML file: ${err.message}`);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.send(data);
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ZodError") {
    const errors = handleZodValidationError(err);
    res.status(err.status || 500).json({
      message: "Validation error. Invalid data provided",
      errors,
    });
  } else {
    logger.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
    res.status(err.status || 500).json({
      error: {
        message: err.message,
      },
    });
  }
});

export default app;
