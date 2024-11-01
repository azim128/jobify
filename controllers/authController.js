import User from "../models/User.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import { hashPassword } from "../utils/passwordUtils.js";
import jwt from "jsonwebtoken";
import variables from "../config/variable.js";

// Create First Super Admin
export const createFirstSuperAdmin = async (req, res) => {
  try {
    // Check if any user exists in the database
    const userExists = await User.countDocuments();

    if (userExists > 0) {
      return errorResponse(
        res,
        400,
        "Super admin can only be created when no users exist"
      );
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return errorResponse(res, 400, "Please provide name, email and password");
    }

    // Hash password using utility function
    const hashedPassword = await hashPassword(password);

    // Create super admin with all permissions
    const superAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "super-admin",
      permissions: {
        manageAdmins: true,
        manageCompanies: true,
        manageJobs: true,
      },
      isActive: true,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: superAdmin._id, role: superAdmin.role },
      variables.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove password from response
    const superAdminResponse = superAdmin.toObject();
    delete superAdminResponse.password;

    successResponse(res, 201, "Super admin created successfully", {
      user: superAdminResponse,
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 400, "Email already exists");
    }
    errorResponse(res, 500, error.message);
  }
};
