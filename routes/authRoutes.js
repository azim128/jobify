import express from "express";
import { createFirstSuperAdmin } from "../controllers/authController.js";

const router = express.Router();

// Route to create first super admin
router.post("/create-first-super-admin", createFirstSuperAdmin);

// ... other auth routes ...

export default router;
