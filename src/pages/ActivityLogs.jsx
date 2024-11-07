import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivityLogsAsync } from "../features/superadmin/superAdminSlice";
import ActivityLogFilters from "../components/admin/ActivityLogFilters";
import ActivityLogTable from "../components/admin/ActivityLogTable";
import ActivityLogSkeleton from "../components/admin/ActivityLogSkeleton";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { activityLogs, loading, error, pagination } = useSelector(
    (state) => state.suadmin
  );
  const { token } = useSelector((state) => state.auth);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filters, setFilters] = useState({
    resource: "",
    action: "",
    startDate: "",
    endDate: "",
    sort: "-createdAt",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        await dispatch(getActivityLogsAsync({ token, ...filters }));
        setIsInitialLoad(false);
      }
    };
    fetchData();
  }, [dispatch, token, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleRetry = () => {
    dispatch(getActivityLogsAsync({ token, ...filters }));
  };

  const renderError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
      <div className="mb-4">
        <svg
          className="h-12 w-12 text-red-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Error Loading Activity Logs
      </h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={handleRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderPagination = () => {
    if (!pagination) return null;

    const { currentPage = 1, totalPages = 1, totalLogs = 0 } = pagination;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
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
          <span>Show:</span>
          <select
            value={filters.limit}
            onChange={handleLimitChange}
            className="border rounded px-2 py-1"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>entries</span>
          <span className="ml-4">Total: {totalLogs} logs</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {startPage > 1 && <span className="px-2">...</span>}
          {pages}
          {endPage < totalPages && <span className="px-2">...</span>}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading && isInitialLoad) {
      return <ActivityLogSkeleton />;
    }

    if (error) {
      return renderError();
    }

    if (!activityLogs || activityLogs.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="h-12 w-12 text-gray-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Activity Logs Found
          </h3>
          <p className="text-gray-600">
            There are no activity logs matching your current filters.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className={loading ? "opacity-60 pointer-events-none" : ""}>
          <ActivityLogTable logs={activityLogs} />
        </div>
        {renderPagination()}
      </>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <ActivityLogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      {renderContent()}
    </div>
  );
};

export default ActivityLogs;
