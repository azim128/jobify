import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAdminsAsync,
  createAdminAsync,
  updateAdminAsync,
  deleteAdminAsync,
} from "../features/superadmin/superAdminSlice";
import AdminCard from "../components/admin/AdminCard";
import AdminModal from "../components/admin/AdminModal";
import AdminSkeleton from "../components/admin/AdminSkeleton";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const ManageAdmins = () => {
  const dispatch = useDispatch();
  const { admins, loading, error } = useSelector((state) => state.suadmin);
  const { token } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllAdminsAsync(token));
      setIsInitialLoad(false);
    };
    fetchData();
  }, [dispatch, token]);

  const handleCreateAdmin = async (formData) => {
    const result = await dispatch(
      createAdminAsync({ adminData: formData, token })
    );
    if (result.meta.requestStatus === "fulfilled") {
      setIsModalOpen(false);
      dispatch(getAllAdminsAsync(token));
    }
  };

  const handleUpdateAdmin = async (formData) => {
    const result = await dispatch(
      updateAdminAsync({
        adminId: selectedAdmin._id,
        updatedData: formData,
        token,
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      setIsModalOpen(false);
      setSelectedAdmin(null);
      dispatch(getAllAdminsAsync(token));
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    await dispatch(deleteAdminAsync({ adminId, token }));
    dispatch(getAllAdminsAsync(token));
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
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
    const totalPages = Math.ceil(admins.length / itemsPerPage);
    const pages = [];

    // For mobile, show limited page numbers
    const getVisiblePages = () => {
      if (isMobileView) {
        if (totalPages <= 3)
          return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 2) return [1, 2, 3, "...", totalPages];
        if (currentPage >= totalPages - 1)
          return [1, "...", totalPages - 2, totalPages - 1, totalPages];
        return [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    getVisiblePages().forEach((page) => {
      pages.push(
        page === "..." ? (
          <span key={`ellipsis-${page}`} className="px-3 py-1">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        )
      );
    });

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
        <div className="flex flex-wrap items-center space-x-2">
          <span className="whitespace-nowrap">Show:</span>
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
          <span className="whitespace-nowrap">entries</span>
          <span className="ml-4 whitespace-nowrap">
            Total: {admins.length} admins
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex flex-wrap justify-center gap-1">{pages}</div>
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

  const renderAdminList = () => {
    if (loading && isInitialLoad) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[...Array(4)].map((_, index) => (
            <AdminSkeleton key={index} />
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

    if (!admins || admins.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No admins available</p>
        </div>
      );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAdmins = admins.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {paginatedAdmins.map((admin) => (
          <AdminCard
            key={admin._id}
            admin={admin}
            onEdit={handleEdit}
            onDelete={handleDeleteAdmin}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <div className="flex flex-wrap  gap-3">
          <Link
            to="/activity-logs"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm sm:text-base whitespace-nowrap"
          >
            View Activity Logs
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base whitespace-nowrap"
          >
            Add Admin
          </button>
        </div>
      </div>

      {/* Admin List with loading state */}
      <div className={loading && !isInitialLoad ? "opacity-60" : ""}>
        {renderAdminList()}
      </div>

      {/* Pagination */}
      {(!loading || !isInitialLoad) &&
        admins &&
        admins.length > 0 &&
        renderPagination()}

      {/* Modal */}
      {isModalOpen && (
        <AdminModal
          admin={selectedAdmin}
          onSubmit={selectedAdmin ? handleUpdateAdmin : handleCreateAdmin}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAdmin(null);
          }}
          isSubmitting={false}
        />
      )}
    </div>
  );
};

export default ManageAdmins;
