import axios from "axios";
import { server_uri } from "../config/variables";

const baseURL = `${server_uri}api/v1`;

const authAPI = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = (email, password) =>
  authAPI.post("/auth/login", { email, password });

export const forgotPassword = (email) =>
  authAPI.post("/auth/forgot-password", { email });

export const resetPassword = (resetToken, password) =>
  authAPI.post(`/auth/reset-password/${resetToken}`, { password });

export default authAPI;
