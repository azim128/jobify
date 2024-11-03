import User from "../models/User.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/jwtUtils.js";

export const createFirstSuperAdminService = async (userData) => {
  const { name, email, password } = userData;

  // Check if any user exists
  const userExists = await User.countDocuments();
  if (userExists > 0) {
    const error = new Error(
      "Super admin can only be created when no users exist"
    );
    error.status = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create super admin
  const superAdmin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "super-admin",
    permissions: {
      manageAdmins: true,
      manageCompanies: true,
      manageJobs: true,
      useAI: true,
      uploadFiles: true,
    },
    isActive: true,
  });

  // Generate token
  const token = generateToken(superAdmin._id, superAdmin.role);

  // Remove password from response
  const userResponse = superAdmin.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

export const createAdminService = async (adminData) => {
  const { name, email, password, permissions } = adminData;

  // Check if email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already exists");
    error.status = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create admin
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    permissions: {
      manageAdmins: false,
      ...permissions,
    },
    isActive: true,
  });

  // Remove password from response
  const adminResponse = admin.toObject();
  delete adminResponse.password;

  return adminResponse;
};

export const getAdminsService = async () => {
  return await User.find({ role: "admin" })
    .select("-password")
    .sort("-createdAt");
};

export const getAdminByIdService = async (adminId) => {
  const admin = await User.findOne({ _id: adminId, role: "admin" }).select(
    "-password"
  );

  if (!admin) {
    const error = new Error("Admin not found");
    error.status = 404;
    throw error;
  }

  return admin;
};

export const updateAdminService = async (adminId, updateData) => {
  const admin = await User.findOne({ _id: adminId, role: "admin" });
  if (!admin) {
    const error = new Error("Admin not found");
    error.status = 404;
    throw error;
  }

  // If updating email, check if new email exists
  if (updateData.email && updateData.email !== admin.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser) {
      const error = new Error("Email already exists");
      error.status = 400;
      throw error;
    }
  }

  // Ensure manageAdmins permission stays false
  if (updateData.permissions) {
    updateData.permissions.manageAdmins = false;
  }

  const updatedAdmin = await User.findByIdAndUpdate(adminId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedAdmin;
};

export const deleteAdminService = async (adminId) => {
  const admin = await User.findOneAndDelete({
    _id: adminId,
    role: "admin",
  });

  if (!admin) {
    const error = new Error("Admin not found");
    error.status = 404;
    throw error;
  }
};
