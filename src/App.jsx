import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateSuperAdmin from "./pages/CreateSuperAdmin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionGuard from "./components/PermissionGuard";
import { PERMISSIONS } from "./utils/permissions";

// Import your other protected pages
import ManageAdmins from "./pages/ManageAdmins";
import ManageCompanies from "./pages/ManageCompanies";
import ManageJobs from "./pages/ManageJobs";
import JobDetails from "./pages/JobDetails";
import AdminDetails from "./pages/AdminDetails";
import ActivityLogs from "./pages/ActivityLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/create-super-admin" element={<CreateSuperAdmin />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* Permission-based routes */}
            <Route
              path="/manage-admins"
              element={
                <PermissionGuard permission={PERMISSIONS.MANAGE_ADMINS}>
                  <ManageAdmins />
                </PermissionGuard>
              }
            />
            <Route
              path="/manage-admins/:adminId"
              element={
                <PermissionGuard permission={PERMISSIONS.MANAGE_ADMINS}>
                  <AdminDetails />
                </PermissionGuard>
              }
            />
            <Route
              path="/activity-logs"
              element={
                <PermissionGuard permission={PERMISSIONS.MANAGE_ADMINS}>
                  <ActivityLogs />
                </PermissionGuard>
              }
            />
            <Route
              path="/manage-companies"
              element={
                <PermissionGuard permission={PERMISSIONS.MANAGE_COMPANIES}>
                  <ManageCompanies />
                </PermissionGuard>
              }
            />
            <Route
              path="/manage-jobs"
              element={
                <PermissionGuard permission={PERMISSIONS.MANAGE_JOBS}>
                  <ManageJobs />
                </PermissionGuard>
              }
            />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
