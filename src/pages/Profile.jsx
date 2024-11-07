import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-medium capitalize">{user?.role}</p>
          </div>
          <div>
            <p className="text-gray-600">Account Status</p>
            <p
              className={`font-medium ${
                user?.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {user?.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Permissions</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(user?.permissions || {}).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
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
      </div>
    </div>
  );
};

export default Profile;
