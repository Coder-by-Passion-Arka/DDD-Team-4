import { Router } from "express";
const router = Router();

// Example assignments route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Assignments route works!" });
});

export default router;
