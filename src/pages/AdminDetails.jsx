import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleAdminAsync } from "../features/superadmin/superAdminSlice";
import Skeleton from "../components/common/Skeleton";

const AdminDetails = () => {
  const { adminId } = useParams();
  const dispatch = useDispatch();
  const { adminDetails: admin, loading } = useSelector(
    (state) => state.suadmin
  );
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSingleAdminAsync({ adminId, token }));
  }, [dispatch, adminId, token]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{admin.name}</h1>
          <p className="text-gray-600">{admin.email}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Permissions</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(admin.permissions || {}).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center space-x-2 text-gray-700"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    value ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Account Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium">
                {admin.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Created At</p>
              <p className="font-medium">
                {new Date(admin.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
