import Company from "../models/Company.js";
import FileUpload from "../models/FileUpload.js";
import {
  uploadFileToCloudinary,
  createFileUploadRecord,
} from "./fileService.js";

export const createCompanyService = async (
  companyData,
  userId,
  file = null
) => {
  const { name, description, location, industry } = companyData;

  // Check for existing company
  const existingCompany = await Company.findOne({ name });
  if (existingCompany) {
    const error = new Error("Company name already exists");
    error.status = 409;
    throw error;
  }

  // Create company
  const company = await Company.create({
    name,
    description,
    location,
    industry,
    createdBy: userId,
  });

  // Handle logo upload if exists
  if (file) {
    const logoUrl = await uploadFileToCloudinary(file, "company-logos");
    await createFileUploadRecord({
      fileType: "logo",
      url: logoUrl,
      uploadedBy: userId,
      company: company._id,
    });

    company.logo = logoUrl;
    await company.save();
  }

  return company;
};

export const getCompaniesService = async (query = {}) => {
  const companies = await Company.find(query)
    .sort("-createdAt")
    .populate("createdBy", "name email");

  return companies;
};

export const getCompanyByIdService = async (companyId) => {
  const company = await Company.findById(companyId).populate(
    "createdBy",
    "name email"
  );

  if (!company) {
    const error = new Error("Company not found");
    error.status = 404;
    throw error;
  }

  return company;
};

export const updateCompanyService = async (
  companyId,
  updateData,
  userId,
  file = null
) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new Error("Company not found");
    error.status = 404;
    throw error;
  }

  // Handle logo upload if exists
  if (file) {
    const logoUrl = await uploadFileToCloudinary(file, "company-logos");
    await createFileUploadRecord({
      fileType: "logo",
      url: logoUrl,
      uploadedBy: userId,
      company: companyId,
    });
    updateData.logo = logoUrl;
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("createdBy", "name email");

  return updatedCompany;
};

export const deleteCompanyService = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new Error("Company not found");
    error.status = 404;
    throw error;
  }

  // Delete associated file uploads
  await FileUpload.deleteMany({ company: companyId });
  await company.deleteOne();
};
