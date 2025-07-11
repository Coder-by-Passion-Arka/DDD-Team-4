import { Router } from "express";
const router = Router();

// Example admin route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Admin route works!" });
});

export default router;
