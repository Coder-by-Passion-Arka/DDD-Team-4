// Creating Winston Logger for logging. This helps log errors, warnings, and other important events to console and file.

import { createLogger, format, transports, Logger } from "winston";

const { combine, timestamp, colorize, json, printf } = format;

// Console log format with color and timestamp
const consoleLogFormat = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
  })
);

// Create the logger instance
const logger: Logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: consoleLogFormat,
    }),
  ],
});

export default logger;
