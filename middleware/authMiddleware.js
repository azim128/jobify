import User from "../models/User.js";
import { errorResponse } from "../helpers/responseHelper.js";
import { verifyToken } from "../utils/jwtUtils.js";

// Authenticate user using JWT
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return errorResponse(res, 401, "Authentication invalid");
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify token using utility function
      const decoded = verifyToken(token);

      // Get user from database
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return errorResponse(res, 401, "User not found");
      }

      if (!user.isActive) {
        return errorResponse(res, 401, "User account is deactivated");
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return errorResponse(res, 401, "Authentication invalid");
    }
  } catch (error) {
    next(error);
  }
};

// Authorize roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};

// Check permissions
export const checkPermission = (permission) => {
  return (req, res, next) => {
    // Super admin has all permissions
    if (req.user.role === "super-admin") {
      return next();
    }

    // Check if admin has specific permission
    if (!req.user.permissions[permission]) {
      return errorResponse(
        res,
        403,
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};
