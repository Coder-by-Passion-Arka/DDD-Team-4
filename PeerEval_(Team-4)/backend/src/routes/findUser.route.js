// import express from "express";
// import { findStudent } from "../controllers/findStudent.controller.js";
// import { findTeacher } from "../controllers/findTeacher.controller.js";
// import {
//   errorHandler,
//   verifyJWT,
//   isAdmin,
//   isTeacher,
// } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // Apply middleware
// router.use(express.json());
// router.use(errorHandler);

// // Route to find student - accessible by teachers and admins
// router
// .route("/find-student")
// .get(verifyJWT, isTeacher, findStudent)
// .route("/profile");

// // Route to find teacher - accessible by admins only
// router.route("/find-teacher").get(verifyJWT, isAdmin, findTeacher);

// // Route for unauthorized access
// // router.route("/not-authorised").get((request, response) => {
// //   response.status(403).json({
// //     success: false,
// //     message:
// //       "Unauthorized access. You don't have permission to access this resource.",
// //     statusCode: 403,
// //   });
// // });

// // Catch-all route for undefined endpoints
// // router.use("*", (request, response) => {
// //   response.status(404).json({
// //     success: false,
// //     message: "Route not found",
// //     statusCode: 404,
// //   });
// // });

// export default router;
