import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const AdminCard = ({ admin, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      onDelete(admin._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{admin.name}</h3>
          <p className="text-gray-600">{admin.email}</p>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/manage-admins/${admin._id}`}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            View
          </Link>
          <button
            onClick={() => onEdit(admin)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(admin.permissions || {}).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center space-x-2 text-sm text-gray-600"
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
    </div>
  );
};

AdminCard.propTypes = {
  admin: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AdminCard;
