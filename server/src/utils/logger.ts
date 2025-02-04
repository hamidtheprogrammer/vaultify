import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, errors, splat, json } = format;

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({
      filename:
        process.env.NODE_ENV === "production"
          ? "./src/logs/error.log"
          : "./src/logs/error.dev.log",
      level: "error",
    }),
    new transports.File({
      filename:
        process.env.NODE_ENV === "production"
          ? "./src/logs/combined.log"
          : "./src/logs/combined.dev.log",
    }),
  ],
});

export default logger;
