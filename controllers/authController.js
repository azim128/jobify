import User from "../models/User.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/jwtUtils.js";
import crypto from "crypto";
import sendEmail from "../utils/emailUtils.js";
import variables from "../config/variable.js";

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, 400, "Please provide email and password");
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 401, "Your account has been deactivated");
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    successResponse(res, 200, "Login successful", {
      user: userResponse,
      token,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "Please provide email");
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "No user found with this email");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiration (10 minutes)
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // Save to user
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${variables.FRONTEND_URL}/reset-password/${resetToken}`;

    // Create email message
    const message = `
      You are receiving this email because you (or someone else) has requested to reset your password.
      Please click on the following link to reset your password:
      \n\n${resetUrl}\n\n
      This link will expire in 10 minutes.
      If you didn't request this, please ignore this email.
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });

      successResponse(res, 200, "Password reset email sent");
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return errorResponse(res, 500, "Error sending email");
    }
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    if (!password) {
      return errorResponse(res, 400, "Please provide new password");
    }

    // Hash token
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user with token and check if token is expired
    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired reset token");
    }

    // Update password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new token for auto login
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    successResponse(res, 200, "Password reset successful", {
      user: userResponse,
      token,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
