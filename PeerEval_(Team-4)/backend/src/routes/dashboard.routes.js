import { Router } from "express";
const router = Router();

// Example dashboard route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Dashboard route works!" });
});

export default router;
