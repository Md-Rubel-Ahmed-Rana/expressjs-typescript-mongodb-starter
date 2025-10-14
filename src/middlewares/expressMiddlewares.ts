import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { corsOptions } from "@/config/corsOptions";
import { loggerMiddleware } from "./logger";
import { HttpStatusCode } from "@/lib/httpStatus";

export const expressMiddlewares = (app: Application) => {
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(helmet());
  // Allow 100MB to be uploaded
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));
  app.use(morgan("dev"));

  // logger
  app.use(loggerMiddleware);
};

export const notFoundRoutes = (app: Application) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`User hit: '${req.originalUrl}' is not exist`);
    res.status(HttpStatusCode.NOT_FOUND).json({
      statusCode: HttpStatusCode.NOT_FOUND,
      success: false,
      message: "Resource not found.",
      errorMessages: [
        {
          path: req.originalUrl,
          message: "The requested API endpoint does not exist.",
        },
      ],
    });
    next();
  });
};
