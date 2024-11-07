import PropTypes from "prop-types";

const CompanyCard = ({ company, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      onDelete(company._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <img
          src={company.logo || "/default-company-logo.png"}
          alt={company.name}
          className="h-16 w-16 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{company.name}</h3>
          <p className="text-gray-600">{company.industry}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm">
          <span className="font-medium">Location:</span> {company.location}
        </p>
        <p className="text-sm">
          <span className="font-medium">Description:</span>{" "}
          {company.description}
        </p>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(company)}
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
  );
};

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CompanyCard;
