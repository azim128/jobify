import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const JobCard = ({ job, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      onDelete(job._id);
    }
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <img
          src={job.company?.logo || "/default-company-logo.png"}
          alt={job.company?.name}
          className="h-12 w-12 object-cover rounded"
        />
        <div className="flex-1">
          <Link
            to={`/jobs/${job._id}`}
            className="text-lg font-semibold hover:text-blue-600"
          >
            {job.title}
          </Link>
          <p className="text-gray-600">{job.company?.name}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Salary Range</p>
          <p className="font-medium">
            {formatSalary(job.salaryRange.min)} -{" "}
            {formatSalary(job.salaryRange.max)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Level</p>
          <p className="font-medium capitalize">{job.level}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-medium">{job.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Type</p>
          <p className="font-medium capitalize">{job.type}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(job)}
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

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default JobCard;
