import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobDetails } from "../features/jobs/jobSlice";
import Skeleton from "../components/common/Skeleton";

const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { jobDetails: job, loading } = useSelector((state) => state.job);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobDetails({ jobId, token }));
  }, [dispatch, jobId, token]);

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

  if (!job) return null;

  const formatSalary = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={job.company?.logo || "/default-company-logo.png"}
            alt={job.company?.name}
            className="h-16 w-16 object-cover rounded"
          />
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.company?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Salary Range</p>
            <p className="font-medium">
              {formatSalary(job.salaryRange.min)} -{" "}
              {formatSalary(job.salaryRange.max)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium">{job.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-medium capitalize">{job.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Level</p>
            <p className="font-medium capitalize">{job.level}</p>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{job.description}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Requirements</h2>
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-gray-700">
                  {req}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="text-gray-700">
                  {resp}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
