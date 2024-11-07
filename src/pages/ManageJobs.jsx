import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  createNewJob,
  updateExistingJob,
  deleteExistingJob,
} from "../features/jobs/jobSlice";
import JobCard from "../components/job/JobCard";
import JobModal from "../components/job/JobModal";
import JobSkeleton from "../components/job/JobSkeleton";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const ManageJobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error, pagination } = useSelector(
    (state) => state.job
  );
  const { token } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        fetchJobs({ token, page: currentPage, limit: itemsPerPage })
      );
      setIsInitialLoad(false);
    };
    fetchData();
  }, [dispatch, token, currentPage, itemsPerPage]);

  const handleCreateJob = async (formData) => {
    const result = await dispatch(createNewJob({ jobData: formData, token }));
    if (result.meta.requestStatus === "fulfilled") {
      setIsModalOpen(false);
      dispatch(fetchJobs({ token, page: currentPage, limit: itemsPerPage }));
    }
  };

  const handleUpdateJob = async (formData) => {
    const result = await dispatch(
      updateExistingJob({
        jobId: selectedJob._id,
        jobData: formData,
        token,
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      setIsModalOpen(false);
      setSelectedJob(null);
      dispatch(fetchJobs({ token, page: currentPage, limit: itemsPerPage }));
    }
  };

  const handleDeleteJob = async (jobId) => {
    await dispatch(deleteExistingJob({ jobId, token }));
    dispatch(fetchJobs({ token, page: currentPage, limit: itemsPerPage }));
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const { currentPage, totalPages, totalJobs } = pagination;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-gray-600">Total Jobs: {totalJobs}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="mx-2">{pages}</div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderJobList = () => {
    if (loading && isInitialLoad) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(itemsPerPage)].map((_, index) => (
            <JobSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      );
    }

    if (!jobs || jobs.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No jobs available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onEdit={handleEdit}
            onDelete={handleDeleteJob}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Job
        </button>
      </div>

      {/* Job List with loading state */}
      <div className={loading && !isInitialLoad ? "opacity-60" : ""}>
        {renderJobList()}
      </div>

      {/* Pagination - always visible if there are jobs */}
      {(!loading || !isInitialLoad) &&
        jobs &&
        jobs.length > 0 &&
        renderPagination()}

      {isModalOpen && (
        <JobModal
          job={selectedJob}
          onSubmit={selectedJob ? handleUpdateJob : handleCreateJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageJobs;
