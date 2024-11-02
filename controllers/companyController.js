import Company from "../models/Company.js";
import FileUpload from "../models/FileUpload.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import cloudinary from "../config/cloudinaryConfig.js";

// Create company with logo upload
export const createCompany = async (req, res) => {
  try {
    const { name, description, location, industry } = req.body;

    // Validate required fields
    if (!name || !location || !industry) {
      return errorResponse(res, 400, "Please provide all required fields");
    }
    // Check for existing company with the same name
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return errorResponse(res, 409, "Company name already exists");
    }
    // Create company without logo first
    const company = await Company.create({
      name,
      description,
      location,
      industry,
      createdBy: req.user._id,
    });

    // If logo file exists, upload to cloudinary
    if (req.file) {
      try {
        // Upload to cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "company-logos",
          width: 300,
          crop: "scale",
        });

        // Create file upload record
        const fileUpload = await FileUpload.create({
          fileType: "logo",
          url: result.secure_url,
          uploadedBy: req.user._id,
          company: company._id,
        });

        // Update company with logo URL
        company.logo = result.secure_url;
        await company.save();
      } catch (error) {
        // If cloudinary upload fails, still create company but without logo
        console.error("Logo upload failed:", error);
      }
    }

    successResponse(res, 201, "Company created successfully", company);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .sort("-createdAt")
      .populate("createdBy", "name email");

    successResponse(res, 200, "Companies retrieved successfully", companies);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Get single company
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!company) {
      return errorResponse(res, 404, "Company not found");
    }

    successResponse(res, 200, "Company retrieved successfully", company);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { name, description, location, industry } = req.body;
    const companyId = req.params.id;

    // Find company
    const company = await Company.findById(companyId);
    if (!company) {
      return errorResponse(res, 404, "Company not found");
    }

    // Update basic fields
    const updates = {
      name: name || company.name,
      description: description || company.description,
      location: location || company.location,
      industry: industry || company.industry,
    };

    // If new logo file exists, upload to cloudinary
    if (req.file) {
      try {
        // Upload to cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "company-logos",
          width: 300,
          crop: "scale",
        });

        // Create file upload record
        await FileUpload.create({
          fileType: "logo",
          url: result.secure_url,
          uploadedBy: req.user._id,
          company: companyId,
        });

        // Update company with new logo URL
        updates.logo = result.secure_url;
      } catch (error) {
        console.error("Logo upload failed:", error);
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    successResponse(res, 200, "Company updated successfully", updatedCompany);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return errorResponse(res, 404, "Company not found");
    }

    // Delete associated file uploads
    await FileUpload.deleteMany({ company: company._id });

    // Delete company
    await company.deleteOne();

    successResponse(res, 204, "Company deleted successfully", null);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
