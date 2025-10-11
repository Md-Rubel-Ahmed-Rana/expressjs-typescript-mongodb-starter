import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { corsOptions } from "@/config/corsOptions";
import { loggerMiddleware } from "./logger";

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
    res.status(404).json({
      success: false,
      message: "Not Found",
      errorMessages: [
        {
          path: req.originalUrl,
          message: "API Not Found",
        },
      ],
    });
    next();
  });
};
