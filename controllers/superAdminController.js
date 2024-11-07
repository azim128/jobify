import User from "../models/User.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/jwtUtils.js";

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

    // Generate JWT token using utility function
    const token = generateToken(superAdmin._id, superAdmin.role);

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

// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return errorResponse(res, 400, "Please provide name, email and password");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, "Email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin with specified or default permissions
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      permissions: {
        manageAdmins: false,
        manageCompanies: permissions?.manageCompanies ?? true,
        manageJobs: permissions?.manageJobs ?? true,
        useAI: permissions?.useAI ?? true,
        uploadFiles: permissions?.uploadFiles ?? true,
      },
      isActive: true,
    });

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    successResponse(res, 201, "Admin created successfully", adminResponse);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort("-createdAt");

    successResponse(res, 200, "Admins retrieved successfully", admins);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Get single admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.params.id,
      role: "admin",
    }).select("-password");

    if (!admin) {
      return errorResponse(res, 404, "Admin not found");
    }

    successResponse(res, 200, "Admin retrieved successfully", admin);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    const { name, permissions, isActive } = req.body;
    const adminId = req.params.id;

    // Find admin
    const admin = await User.findOne({ _id: adminId, role: "admin" });
    if (!admin) {
      return errorResponse(res, 404, "Admin not found");
    }

    // Update fields
    const updates = {
      name: name || admin.name,
      isActive: typeof isActive === "boolean" ? isActive : admin.isActive,
      permissions: {
        ...admin.permissions,
        ...(permissions && {
          manageCompanies:
            permissions.manageCompanies ?? admin.permissions.manageCompanies,
          manageJobs: permissions.manageJobs ?? admin.permissions.manageJobs,
          uploadFiles: permissions.uploadFiles ?? admin.permissions.uploadFiles,
          manageAdmins: false,
        }),
      },
    };

    const updatedAdmin = await User.findByIdAndUpdate(adminId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    successResponse(res, 200, "Admin updated successfully", updatedAdmin);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findOneAndDelete({
      _id: req.params.id,
      role: "admin",
    });

    if (!admin) {
      return errorResponse(res, 404, "Admin not found");
    }

    successResponse(res, 204, "Admin deleted successfully", null);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
