import express from "express";
import {
  findStudent,
  findTeacher,
} from "../controllers/findUser.controller.js";
import {
  errorHandler,
  verifyJWT,
  isAdmin,
  isTeacherOrAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply middleware
router.use(express.json());

// Route to find student - accessible by teachers and admins
router.route("/find-student").get(verifyJWT, isTeacherOrAdmin, findStudent);

// Route to find teacher by ID - accessible by admins only
router.route("/find-teacher/:userId").get(verifyJWT, isAdmin, findTeacher);

// Alternative route for finding teacher by query params (if needed)
router.route("/find-teacher").get(verifyJWT, isAdmin, (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required as query parameter",
    });
  }
  req.params.userId = userId;
  findTeacher(req, res);
});

// Apply error handler at the end
router.use(errorHandler);

export default router;
