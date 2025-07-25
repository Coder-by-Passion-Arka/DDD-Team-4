import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import logger from "./logger.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Import routes
import healthCheckRouter from "./routes/healthCheck.route.js";
import userRouter from "./routes/auth.route.js";
import allRoutes from "./routes/allRoutes.route.js";
import errorHandler from "./middlewares/errorHandling.middleware.js";

dotenv.config({
  path: "src/.env",
});

const server = express();

// Column names for the Logs
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";

// Enable CORS for cross-origin requests
server.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost on any port for development
      if (origin.match(/^http:\/\/localhost:\d+$/)) {
        return callback(null, true);
      }
      
      // Allow the specific configured origin
      if (origin === process.env.CORS_ORIGIN) {
        return callback(null, true);
      }
      
      // Reject other origins
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Middleware to parse JSON data
server.use(express.json({ limit: "1mb" }));

// Parse URL-encoded data
server.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Serve static files from public folder
// server.use(express.static(path.join(__dirname, "../public")));

// Cookie parser middleware
server.use(cookieParser());

// Serve static files
server.use(express.static("../public"));

// Morgan logging middleware
server.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[4],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Routes
server.use("/api/v1/healthCheck", healthCheckRouter);
server.use("/api/v1", allRoutes);
server.use("/api/v1/user", userRouter);

// Admin routes (commented out until proper auth is implemented)
// TODO: Implement proper authentication middleware
// server.use("/api/admin", adminRouter);

// Error handling middleware (should be last)
server.use(errorHandler);

export default server;

// ================================ //

// import dotenv from "dotenv";

// dotenv.config({
//   path: "src/.env",
// });

// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import logger from "./logger.js";
// import { fileURLToPath } from "url";
// import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const server = express();

// // Column names for the Logs
// const morganFormat =
//   ":method :url :status :response[content-length] - :response-time ms";

// // FIXED: More secure CORS configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);

//     const allowedOrigins = [
//       "http://localhost:3000",
//       "http://localhost:5173",
//       "http://localhost:5174",
//       process.env.FRONTEND_URL,
//       process.env.CORS_ORIGIN,
//     ].filter(Boolean);

//     if (
//       allowedOrigins.includes(origin) ||
//       process.env.NODE_ENV === "development"
//     ) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//     "Accept",
//     "Origin",
//   ],
//   exposedHeaders: ["Set-Cookie"],
//   preflightContinue: false,
//   optionsSuccessStatus: 200,
// };

// server.use(cors(corsOptions));

// // Handle preflight requests
// server.options("*", cors(corsOptions));

// // Middleware to parse JSON data
// server.use(
//   express.json({
//     limit: "1mb",
//     verify: (request, response, buf) => {
//       try {
//         JSON.parse(buf);
//       } catch (e) {
//         response.status(400).json({ error: "Invalid JSON" });
//         throw new Error("Invalid JSON");
//       }
//     },
//   })
// );

// // Parse URL-encoded data
// server.use(
//   express.urlencoded({
//     extended: true,
//     limit: "1mb",
//   })
// );

// // Serve static files from public folder
// server.use(express.static(path.join(__dirname, "../public")));

// // Cookie parser middleware
// server.use(cookieParser());

// // Trust proxy if behind reverse proxy (for production)
// if (process.env.NODE_ENV === "production") {
//   server.set("trust proxy", 1);
// }

// // // Security headers
// // server.use((request, response, next) => {
// //   response.setHeader("X-Frame-Options", "DENY");
// //   response.setHeader("X-Content-Type-Options", "nosniff");
// //   response.setHeader("X-XSS-Protection", "1; mode=block");

// //   if (process.env.NODE_ENV === "production") {
// //     response.setHeader(
// //       "Strict-Transport-Security",
// //       "max-age=31536000; includeSubDomains"
// //     );
// //   }

// //   next();
// // });

// // Morgan logging middleware setup
// server.use(
//   morgan(morganFormat, {
//     stream: {
//       write: (message) => {
//         const logObject = {
//           method: message.split(" ")[0],
//           url: message.split(" ")[1],
//           status: message.split(" ")[2],
//           responseTime: message.split(" ")[4],
//         };
//         logger.info(JSON.stringify(logObject));
//       },
//     },
//   })
// );

// // Import routes
// import apiRoutes from "./routes/allRoutes.route.js";
// import healthCheckRouter from "./routes/healthCheck.route.js";
// import notFound from "./middlewares/auth.middleware.js";
// import errorHandler from "./middlewares/errorHandling.middleware.js";

// // Health check route (before API routes for faster response)
// server.use("/api/health", healthCheckRouter);

// // API routes with versioning
// server.use("/api/v1", apiRoutes);

// // Root endpoint
// server.get("/", (request, response) => {
//   response.status(200).json({
//     success: true,
//     message: "Peer Evaluation Platform API Server",
//     version: "1.0.0",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     documentation: "/api/v1",
//   });
// });

// // 404 handler for unmatched routes
// server.use(notFound);

// // Global error handling middleware (should be last)
// server.use(errorHandler);

// export default server;
