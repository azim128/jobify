import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoadingOverlay from "../common/LoadingOverlay";

const CompanyModal = ({ company, onSubmit, onClose, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    industry: "",
    logo: null,
  });
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        location: company.location || "",
        industry: company.industry || "",
        logo: null,
      });
      setPreviewURL(company.logo || "");
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    // For create operation, validate required fields
    if (
      !company &&
      (!formData.name ||
        !formData.description ||
        !formData.location ||
        !formData.industry)
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Only append changed values for update operation
    if (company) {
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== "" &&
          (key === "logo"
            ? formData[key] !== null
            : formData[key] !== company[key])
        ) {
          data.append(key, formData[key]);
        }
      });
    } else {
      // Append all values for create operation
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          (key !== "logo" || formData[key] !== null)
        ) {
          data.append(key, formData[key]);
        }
      });
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      {isSubmitting && <LoadingOverlay message="Saving company..." />}
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">
          {company ? "Update Company" : "Create Company"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name {!company && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!!company}
              required={!company}
              className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${
                company ? "bg-gray-100" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description {!company && <span className="text-red-500">*</span>}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required={!company}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location {!company && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required={!company}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Industry {!company && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required={!company}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
            {previewURL && (
              <img
                src={previewURL}
                alt="Preview"
                className="mt-2 h-20 w-20 object-cover rounded"
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {company ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CompanyModal.propTypes = {
  company: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default CompanyModal;
