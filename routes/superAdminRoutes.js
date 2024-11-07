import express from "express";
import {
  createFirstSuperAdmin,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/superAdminController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - only works once when no users exist
router.post("/create-first-super-admin", createFirstSuperAdmin);

// Protected routes - only accessible by super-admin
router.use(authenticateUser, authorizeRoles("super-admin"));

router.post("/create-admin", createAdmin);
router.get("/admins", getAllAdmins);
router.get("/admins/:id", getAdminById);
router.patch("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);

export default router;
