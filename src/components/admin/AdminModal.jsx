import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoadingOverlay from "../common/LoadingOverlay";

const PERMISSIONS = [
  { key: "manageAdmins", label: "Manage Admins", alwaysDisabled: true },
  { key: "manageCompanies", label: "Manage Companies" },
  { key: "manageJobs", label: "Manage Jobs" },
  { key: "uploadFiles", label: "Upload Files" },
];

const AdminModal = ({ admin, onSubmit, onClose, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: {
      manageAdmins: false,
      manageCompanies: false,
      manageJobs: false,
      uploadFiles: false,
    },
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        password: "",
        permissions: admin.permissions || {
          manageAdmins: false,
          manageCompanies: false,
          manageJobs: false,
          uploadFiles: false,
        },
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (admin) {
      // For update, only include changed fields
      const changedData = {};
      if (formData.name !== admin.name) changedData.name = formData.name;
      if (formData.email !== admin.email) changedData.email = formData.email;
      if (formData.password) changedData.password = formData.password;

      // Check if permissions have changed
      let hasPermissionChanges = false;
      Object.keys(formData.permissions).forEach((key) => {
        if (formData.permissions[key] !== admin.permissions?.[key]) {
          hasPermissionChanges = true;
        }
      });
      if (hasPermissionChanges) {
        changedData.permissions = formData.permissions;
      }

      onSubmit(changedData);
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      {isSubmitting && <LoadingOverlay message="Saving admin..." />}
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">
          {admin ? "Update Admin" : "Create Admin"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name {!admin && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="name"
              required={!admin}
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email {!admin && <span className="text-red-500">*</span>}
            </label>
            <input
              type="email"
              name="email"
              required={!admin}
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password {!admin && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              required={!admin}
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="space-y-2">
              {PERMISSIONS.map(({ key, label, alwaysDisabled }) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={formData.permissions[key]}
                    onChange={() => handlePermissionChange(key)}
                    disabled={alwaysDisabled}
                    className={`h-4 w-4 rounded border-gray-300 ${
                      alwaysDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 cursor-pointer"
                    }`}
                  />
                  <label
                    htmlFor={key}
                    className={`ml-2 ${
                      alwaysDisabled ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {admin ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AdminModal.propTypes = {
  admin: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default AdminModal;
