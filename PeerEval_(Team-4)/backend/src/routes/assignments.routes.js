import { Router } from "express";
import {
  verifyJWT,
  isTeacherOrAdmin,
  validateRequiredFields,
} from "../middlewares/auth.middleware.js";
// import { createAssignment} from "../controllers/assignment.controller.js";
import Assignment from "../models/assignment.models.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assignments" });
  }
});

// Create a new assignment
router.post("/", async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(400).json({ success: false, message: "Failed to create assignment" });
  }
});

// Get a specific assignment by ID
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }
    res.status(200).json({ success: true, assignment });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assignment" });
  }
});

// Update an assignment
router.put("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }
    res.status(200).json({ success: true, assignment });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(400).json({ success: false, message: "Failed to update assignment" });
  }
});

// Delete an assignment
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }
    res.status(200).json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ success: false, message: "Failed to delete assignment" });
  }
});

export default router;
