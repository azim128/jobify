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
          <span>Show:</span>
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
          <span>entries</span>
          <span className="ml-4">Total: {admins.length} admins</span>
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

  const renderAdminList = () => {
    if (loading && isInitialLoad) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

    // Paginate admins
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAdmins = admins.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <div className="space-x-4">
          <Link
            to="/activity-logs"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            View Activity Logs
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Admin
          </button>
        </div>
      </div>

      {/* Admin List with loading state */}
      <div className={loading && !isInitialLoad ? "opacity-60" : ""}>
        {renderAdminList()}
      </div>

      {/* Pagination - always visible if there are admins */}
      {(!loading || !isInitialLoad) &&
        admins &&
        admins.length > 0 &&
        renderPagination()}

      {isModalOpen && (
        <AdminModal
          admin={selectedAdmin}
          onSubmit={selectedAdmin ? handleUpdateAdmin : handleCreateAdmin}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAdmin(null);
          }}
          isSubmitting={false} // Don't show loading in modal
        />
      )}
    </div>
  );
};

export default ManageAdmins;
