import express, { Application } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import "./events/index";
import { AppRoutes } from "./routes";
import {
  expressMiddlewares,
  notFoundRoutes,
} from "./middlewares/expressMiddlewares";
import dotenv from "dotenv";
import "@/config/passport";
import { initiatePassportSession } from "./middlewares/session";

dotenv.config();

const app: Application = express();

// middlewares
expressMiddlewares(app);

// initialize passport session
initiatePassportSession(app);

// health check
app.get("/", async (req, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message:
      "Modular Express.js + MongoDB Server Boilerplate application is up and running",
    data: null,
  });
});

// applications routes
app.use("/api/v1", AppRoutes);

// global error handler
app.use(globalErrorHandler.globalErrorHandler);

// app route not found
notFoundRoutes(app);

export default app;
