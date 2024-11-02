import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import {
  authenticateUser,
  checkPermission,
} from "../middleware/authMiddleware.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

router.use(authenticateUser);
router.use(checkPermission("manageCompanies"));

// Routes with file upload middleware
router.post("/", upload.single("logo"), createCompany);
router.patch("/:id", upload.single("logo"), updateCompany);

// Other routes
router.get("/", getAllCompanies);
router.get("/:id", getCompany);
router.delete("/:id", deleteCompany);

export default router;
