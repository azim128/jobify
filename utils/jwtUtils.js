import jwt from "jsonwebtoken";
import variables from "../config/variable.js";

// Generate JWT Token
export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, variables.JWT_SECRET, { expiresIn: "1d" });
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, variables.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
