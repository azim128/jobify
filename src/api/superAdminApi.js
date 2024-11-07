import api from "./apiConfig";

// Create a new admin
export const createAdmin = (adminData, token) =>
  api.post("/super-admin/create-admin", adminData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all admins
export const getAllAdmins = (token) =>
  api.get("/super-admin/admins", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get single admin
export const getSingleAdmin = (adminId, token) =>
  api.get(`/super-admin/admins/${adminId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Update admin
export const updateAdmin = (adminId, updatedData, token) =>
  api.patch(`/super-admin/admins/${adminId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Delete admin
export const deleteAdmin = (adminId, token) =>
  api.delete(`/super-admin/admins/${adminId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get activity logs with query parameters
export const getActivityLogs = (token, params = {}) => {
  const queryString = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    sort: params.sort || "-createdAt",
    ...(params.resource && { resource: params.resource }),
    ...(params.action && { action: params.action }),
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
  }).toString();

  return api.get(`/activity-logs?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
