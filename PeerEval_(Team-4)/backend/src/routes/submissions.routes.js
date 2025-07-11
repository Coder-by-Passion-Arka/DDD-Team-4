import { Router } from "express";
const router = Router();

// Example submissions route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Submissions route works!" });
});

export default router;
