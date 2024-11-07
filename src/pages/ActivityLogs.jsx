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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>

      <ActivityLogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className={loading && !isInitialLoad ? "opacity-60" : ""}>
        {loading && isInitialLoad ? (
          <ActivityLogSkeleton />
        ) : (
          <ActivityLogTable logs={activityLogs || []} />
        )}

        {(!loading || !isInitialLoad) &&
          activityLogs?.length > 0 &&
          renderPagination()}
      </div>
    </div>
  );
};

export default ActivityLogs;
