import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./logger";
import connectDB from "./db/index";
import healthCheckRouter from "./routes/healthCheck.routes"; // ✅ Corrected import path

dotenv.config({ path: "./.env" });

const server: Application = express();
const port: number = parseInt(process.env.PORT || "8024", 10);

// -----------------------------
// Middleware Configurations
// -----------------------------

// Enable CORS
server.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON and URL Encoded Middleware
server.use(
  express.json({
    limit: "1mb",
  })
);

server.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// Serve static files
server.use(express.static("../public"));

// Logging HTTP requests using morgan & winston
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";

server.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        const [method, url, status, ...rest] = message.trim().split(" ");
        const responseTime = rest.slice(-2).join(" ");

        const logObject = {
          method,
          url,
          status,
          responseTime,
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// -----------------------------
// Routes
// -----------------------------
server.use("/api/version1/healthCheck", healthCheckRouter);

// -----------------------------
// Start the Server
// -----------------------------
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

export default server;
