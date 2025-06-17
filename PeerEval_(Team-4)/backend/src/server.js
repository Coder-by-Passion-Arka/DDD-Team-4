import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./logger.js"; // logger.js file sets up a logger middleware that logs the errors.
import connectDB from "./db/index.js";
import healthCheckRouter from "./routeshealthCheck.routes.js";

dotenv.config({
  path: "./.env",
});
const server = express();
const port = process.env.PORT || 8024;

server.use(express.json());

// The server will start listening on this port
server.listen(port, () => {
  // Callback function is called when the server is running
  console.log(`Server running on https://localhost:${port}`);
});

// Column names for the Logs
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";

// Enable CORS for cross-origin requests
server.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Enable cookies for cross-origin requests (required for authentication)
    options: {
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Authorization"],
    }, // Additional allowed headers and exposed headers for security reasons. //
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middleware to parse JSON data in incoming requests. This must come after the server.use(cors()); //
server.use(
  express.json({
    limit: "1mb", // Adjust as needed
    credentials: true, // Enable cookies
  })
);

// Used to parse both JSON and URL-encoded data //
server.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
    credentials: true,
  })
);

// Middleware to serve some static files from the "public" folder//
server.use(express.static("../public"));

app.use("/api/version1/healthCheck", healthCheckRouter);

// Middleware to configure and manipulate the information logged by Morgan This must come after the server.use(express.json()); //
server.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

export default server;