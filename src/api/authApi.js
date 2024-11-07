import api from "./apiConfig";

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (resetToken, password) =>
  api.post(`/auth/reset-password/${resetToken}`, { password });
