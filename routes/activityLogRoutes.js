import express from "express";
import {
  getActivityLogs,
  getResourceActivityLogs,
} from "../controllers/activityLogController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes - only accessible by super-admin
router.use(authenticateUser);
router.use(authorizeRoles("super-admin"));

// Get all activity logs with filtering
router.get("/", getActivityLogs);

// Get activity logs for specific resource
router.get("/:resourceId", getResourceActivityLogs);

export default router;
