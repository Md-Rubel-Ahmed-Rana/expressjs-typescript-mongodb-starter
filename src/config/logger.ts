import winston from "winston";
import path from "path";
import { format } from "winston";

const logDirectory = path.join(__dirname, "../../logs");

export const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  defaultMeta: { service: "express-typescript-starter" },
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "success.log"),
      level: "info",
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
      ),
    })
  );
}
