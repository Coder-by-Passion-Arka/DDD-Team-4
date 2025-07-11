import { Router } from "express";
const router = Router();

// Example evaluations route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Evaluations route works!" });
});

export default router;
