import { Router } from "express";
import healthCheck from "../controllers/healthCheck.controller";

// Create a new Router instance
const router: Router = Router();

// Route the healthCheck endpoint to the healthCheck controller
router.get("/", healthCheck);

export default router;
