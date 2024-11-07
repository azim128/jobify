import express from "express";
import { generateJobDescription } from "../controllers/aiController.js";
import {
  authenticateUser,
  checkPermission,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);
router.use(checkPermission("manageJobs"));

// Generate AI job description
router.post("/jobs/generate", generateJobDescription);

export default router;
