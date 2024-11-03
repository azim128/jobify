import express from "express";
import {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import {
  authenticateUser,
  checkPermission,
} from "../middleware/authMiddleware.js";
import upload from "../utils/multerConfig.js";
import { logActivity } from "../middleware/activityLogMiddleware.js";

const router = express.Router();

router.use(authenticateUser);
router.use(checkPermission("manageJobs"));
router.use(logActivity("job"));

// Routes with file upload middleware
router.post("/", upload.single("descriptionFile"), createJob);
router.patch("/:id", upload.single("descriptionFile"), updateJob);

// Other routes
router.get("/", getAllJobs);
router.get("/:id", getJob);
router.delete("/:id", deleteJob);

export default router;
