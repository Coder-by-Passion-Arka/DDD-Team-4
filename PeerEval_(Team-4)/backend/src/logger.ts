// Creatig Winston Logger for logging. This helps us to log errors, warnings, and other important events to a file. //

import { createLogger, format, transports } from "winston";
const { combine, timestamp, colorize, json } = format;

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
  })
);
const logger = createLogger({
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
