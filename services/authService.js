import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/jwtUtils.js";
import crypto from "crypto";
import sendEmail from "../utils/emailUtils.js";
import variables from "../config/variable.js";

export const loginService = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  // Check if user is active
  if (!user.isActive) {
    const error = new Error("Your account has been deactivated");
    error.status = 401;
    throw error;
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id, user.role);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("No user found with this email");
    error.status = 404;
    throw error;
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

  // Create reset URL and email
  const resetUrl = `${variables.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `
    You are receiving this email because you requested to reset your password.
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
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error("Error sending email");
  }
};

export const resetPasswordService = async (resetToken, newPassword) => {
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
    const error = new Error("Invalid or expired reset token");
    error.status = 400;
    throw error;
  }

  // Update password
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new token
  const token = generateToken(user._id, user.role);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};
