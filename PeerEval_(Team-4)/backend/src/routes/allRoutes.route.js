// allRoutes.route.js

import { Router } from "express";
import authRoutes from "./auth.route.js";
import courseRoutes from "./course.route.js";
import assignmentRoutes from "./assignment.route.js";
import evaluationRoutes from "./evaluation.route.js";
import submissionRoutes from "./submission.route.js";
import achievementRoutes from "./achievement.route.js";
import dailyActivityRoutes from "./dailyActivity.route.js";
import leaderboardRoutes from "./leaderboard.route.js";
import preferencesRoutes from "./preferences.route.js";
// import dashboardRoutes from "./dashboard.routes.js";
// import {
//   findStudent,
//   findTeacher,
// } from "../controllers/findUser.controller.js";
import uploadRoutes from "./upload.route.js";
import {
  corsMiddleware,
  securityHeaders,
  requestLogger,
  sanitizeInput,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Apply global middleware
router.use(corsMiddleware);
router.use(securityHeaders);
router.use(requestLogger);
router.use(sanitizeInput);

// Health check route (accessible at /api/health and /api/v1/health)
router.get("/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Server is running properly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/evaluations", evaluationRoutes);
router.use("/submissions", submissionRoutes);
router.use("/achievements", achievementRoutes);
router.use("/dailyActivities", dailyActivityRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/preferences", preferencesRoutes);
// router.use("/dashboard");
router.use("/upload", uploadRoutes);
// router.use("/find-student", findStudent);
// router.use("/find-teacher", findTeacher);

// Add health check
router.get("/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "API v1 is running properly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// Mount v1 routes
router.use("/v1", router);

// API info route (accessible at /api/)
router.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Peer Evaluation Platform API",
    version: "1.0.0",
    documentation: "/api/docs",
    currentVersion: "v1",
    endpoints: {
      health: "/api/health",
      auth: "/api/v1/auth",
      courses: "/api/v1/courses",
      assignments: "/api/v1/assignments",
      evaluations: "/api/v1/evaluations",
      submissions: "/api/v1/submissions",
      achievements: "/api/v1/achievements",
      dailyActivities: "/api/v1/dailyActivities",
      leaderboard: "/api/v1/leaderboard",
      preferences: "/api/v1/preferences",
      upload: "/api/v1/upload",
      // findStudent: "/api/v1/find-student",
      // findTeacher: "/api/v1/find-teacher",
    },
    supportedVersions: ["v1"],
  });
});

// // Add catch-all route for better error handling
// router.use("*", (request, response) => {
//   response.status(404).json({
//     success: false,
//     message: "API endpoint not found",
//     statusCode: 404,
//     path: request.originalUrl,
//     method: request.method,
//     availableEndpoints: [
//       "/api/",
//       "/api/health",
//       "/api/v1/auth",
//       "/api/v1/courses",
//       "/api/v1/assignments",
//       "/api/v1/evaluations",
//       "/api/v1/submissions",
//       "/api/v1/achievements",
//       "/api/v1/dailyActivities",
//       "/api/v1/leaderboard",
//       "/api/v1/preferences",
//       "/api/v1/upload"
//     ]
//   });
// });

// Global error handler
router.use((error, request, response, next) => {
  console.error("API Error:", error);

  response.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    statusCode: error.status || 500,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

export default router;
