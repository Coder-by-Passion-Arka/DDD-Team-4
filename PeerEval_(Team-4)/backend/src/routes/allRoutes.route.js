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
import findUserRoutes from "./findUser.route.js";
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

// API Route for all URL request, even Not Found

// API routes
// 1. Auhtorization Router
router.use("/auth", authRoutes);
// 2. Not Authorised Router
router.use("/not-authorised", authRoutes);
// 3. Course Router
router.use("/courses", courseRoutes);
// 4. Assignment Router
router.use("/assignments", assignmentRoutes);
// 5. Evaluation Router
router.use("/evaluations", evaluationRoutes);
// 6. Submission Router
router.use("/submissions", submissionRoutes);
// 7. Achievement Router
router.use("/achievements", achievementRoutes);
// 8. Daily Activity Router
router.use("/dailyActivities", dailyActivityRoutes);
// 9. Leaderboard Router
router.use("/leaderboard", leaderboardRoutes);
// 10. Preferences Router
router.use("/preferences", preferencesRoutes);
// Find user routes
router.use("/find-user", findUserRoutes);
// 11. Upload Router
router.use("/upload", uploadRoutes);

// router.use("/dashboard");
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
      unauthorised: "/api/v1/not-authorised",
      // findStudent: "/api/v1/find-student",
      // findTeacher: "/api/v1/find-teacher",
      findUser:"api/v1/find-user",
    },
    supportedVersions: ["v1"],
  });
});

// Mount v1 routes
router.use("/v1", router);

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
//       "/api/v1/find-user",
//       "/api/v1/upload",
//     ],
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

// ================================================== //

// // allRoutes.route.js
// import { Router } from "express";
// import authRoutes from "./auth.route.js";
// import courseRoutes from "./course.route.js";
// import assignmentRoutes from "./assignment.route.js";
// import evaluationRoutes from "./evaluation.route.js";
// import submissionRoutes from "./submission.route.js";
// import achievementRoutes from "./achievement.route.js";
// import dailyActivityRoutes from "./dailyActivity.route.js";
// import leaderboardRoutes from "./leaderboard.route.js";
// import preferencesRoutes from "./preferences.route.js";
// import findUserRoutes from "./findUser.route.js";
// import uploadRoutes from "./upload.route.js";
// import {
//   corsMiddleware,
//   securityHeaders,
//   requestLogger,
//   sanitizeInput,
// } from "../middlewares/auth.middleware.js";

// const router = Router();

// // Apply global middleware
// router.use(corsMiddleware);
// router.use(securityHeaders);
// router.use(requestLogger);
// router.use(sanitizeInput);

// // Health check route (accessible at /api/health)
// router.get("/health", (request, response) => {
//   response.status(200).json({
//     success: true,
//     message: "Server is running properly",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     version: "1.0.0",
//   });
// });

// // API info route (accessible at /api/)
// router.get("/", (request, response) => {
//   response.status(200).json({
//     success: true,
//     message: "Peer Evaluation Platform API",
//     version: "1.0.0",
//     documentation: "/api/docs",
//     currentVersion: "v1",
//     endpoints: {
//       health: "/api/health",
//       auth: "/api/v1/auth",
//       courses: "/api/v1/courses",
//       assignments: "/api/v1/assignments",
//       evaluations: "/api/v1/evaluations",
//       submissions: "/api/v1/submissions",
//       achievements: "/api/v1/achievements",
//       dailyActivities: "/api/v1/dailyActivities",
//       leaderboard: "/api/v1/leaderboard",
//       preferences: "/api/v1/preferences",
//       upload: "/api/v1/upload",
//       findUser: "/api/v1/find-user",
//       unauthorised: "/api/v1/not-authorised",
//     },
//     supportedVersions: ["v1"],
//   });
// });

// // Create v1 router
// const v1Router = Router();

// // V1 API routes
// v1Router.use("/auth", authRoutes);
// v1Router.use("/not-authorised", authRoutes);
// v1Router.use("/courses", courseRoutes);
// v1Router.use("/assignments", assignmentRoutes);
// v1Router.use("/evaluations", evaluationRoutes);
// v1Router.use("/submissions", submissionRoutes);
// v1Router.use("/achievements", achievementRoutes);
// v1Router.use("/dailyActivities", dailyActivityRoutes);
// v1Router.use("/leaderboard", leaderboardRoutes);
// v1Router.use("/preferences", preferencesRoutes);
// v1Router.use("/find-user", findUserRoutes); // This is the correct path
// v1Router.use("/upload", uploadRoutes);

// // V1 health check
// v1Router.get("/health", (request, response) => {
//   response.status(200).json({
//     success: true,
//     message: "API v1 is running properly",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     version: "1.0.0",
//   });
// });

// // Mount v1 routes
// router.use("/v1", v1Router);

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
//       "/api/v1/find-user",
//       "/api/v1/upload"
//     ]
//   });
// });

// // Global error handler
// router.use((error, request, response, next) => {
//   console.error("API Error:", error);

//   response.status(error.status || 500).json({
//     success: false,
//     message: error.message || "Internal server error",
//     statusCode: error.status || 500,
//     ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
//   });
// });

// export default router;