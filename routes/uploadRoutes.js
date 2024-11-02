import express from "express";
import {
  authenticateUser,
  checkPermission,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);
router.use(checkPermission("uploadFiles"));

// All upload routes will require uploadFiles permission
router.post("/", (req, res) => {
  res.send(ok);
});
// ... other upload routes

export default router;
