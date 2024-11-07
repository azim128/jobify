export const checkPermission = (user, permission) => {
  if (!user) return false;
  if (user.role === "super-admin") return true;
  return user.permissions?.[permission] || false;
};

export const PERMISSIONS = {
  UPLOAD_FILES: "uploadFiles",
  MANAGE_ADMINS: "manageAdmins",
  MANAGE_COMPANIES: "manageCompanies",
  MANAGE_JOBS: "manageJobs",
};
