import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { checkPermission, PERMISSIONS } from "../utils/permissions";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", permission: null },
    { path: "/profile", label: "Profile", permission: null },
    {
      path: "/manage-admins",
      label: "Manage Admins",
      permission: PERMISSIONS.MANAGE_ADMINS,
    },
    {
      path: "/manage-companies",
      label: "Manage Companies",
      permission: PERMISSIONS.MANAGE_COMPANIES,
    },
    {
      path: "/manage-jobs",
      label: "Manage Jobs",
      permission: PERMISSIONS.MANAGE_JOBS,
    },
  ];

  return (
    <div className="flex">
      <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
          <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map(
              (item) =>
                (!item.permission ||
                  checkPermission(user, item.permission)) && (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="block p-2 hover:bg-gray-700 rounded"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
            )}
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 hover:bg-gray-700 rounded"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
