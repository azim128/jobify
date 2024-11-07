import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanies,
  createNewCompany,
  updateExistingCompany,
  deleteExistingCompany,
} from "../features/company/companySlice";
import CompanyCard from "../components/company/CompanyCard";
import CompanyModal from "../components/company/CompanyModal";
import CompanySkeleton from "../components/company/CompanySkeleton";

const ManageCompanies = () => {
  const dispatch = useDispatch();
  const { companies, loading, error } = useSelector((state) => state.company);
  const { token } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanies(token));
  }, [dispatch, token]);

  const handleCreateCompany = async (formData) => {
    const result = await dispatch(
      createNewCompany({ companyData: formData, token })
    );
    if (result.meta.requestStatus === "fulfilled") {
      setIsModalOpen(false);
    }
  };

  const handleUpdateCompany = async (formData) => {
    const result = await dispatch(
      updateExistingCompany({
        companyId: selectedCompany._id,
        companyData: formData,
        token,
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      setIsModalOpen(false);
      setSelectedCompany(null);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    await dispatch(deleteExistingCompany({ companyId, token }));
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const renderCompanies = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <CompanySkeleton key={index} />
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

    if (companies.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No companies available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard
            key={company._id}
            company={company}
            onEdit={handleEdit}
            onDelete={handleDeleteCompany}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Companies</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Company
        </button>
      </div>

      {renderCompanies()}

      {isModalOpen && (
        <CompanyModal
          company={selectedCompany}
          onSubmit={selectedCompany ? handleUpdateCompany : handleCreateCompany}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageCompanies;
