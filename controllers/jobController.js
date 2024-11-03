import Job from "../models/Job.js";
import Company from "../models/Company.js";
import FileUpload from "../models/FileUpload.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import cloudinary from "../config/cloudinaryConfig.js";
import validateRequiredFields from "../utils/validateRequiredFields.js";

// Create job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      salaryRange,
      location,
      type,
      level,
      companyId,
    } = req.body;

    const requiredFields = [
      "title",
      "description",
      "companyId",
      "type",
      "level",
    ];

    // Parse salary range if it's sent as string
    let parsedSalaryRange = salaryRange;
    if (typeof salaryRange === "string") {
      try {
        parsedSalaryRange = JSON.parse(salaryRange);
      } catch (error) {
        return errorResponse(res, 400, "Invalid salary range format");
      }
    }

    // Validate required fields
    // Check for missing required fields
    const errorMessage = validateRequiredFields(req.body, requiredFields);
    if (errorMessage) {
      return errorResponse(res, 400, errorMessage);
    }

    // Validate salary range
    if (!parsedSalaryRange?.min || !parsedSalaryRange?.max) {
      return errorResponse(res, 400, "Please provide valid salary range");
    }

    // Validate salary range values
    if (parsedSalaryRange.min > parsedSalaryRange.max) {
      return errorResponse(
        res,
        400,
        "Minimum salary cannot be greater than maximum salary"
      );
    }

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return errorResponse(res, 404, "Company not found");
    }

    // Parse arrays if they're sent as strings
    let parsedRequirements = requirements;
    let parsedResponsibilities = responsibilities;

    try {
      if (typeof requirements === "string") {
        parsedRequirements = JSON.parse(requirements);
      }
      if (typeof responsibilities === "string") {
        parsedResponsibilities = JSON.parse(responsibilities);
      }
    } catch (error) {
      return errorResponse(
        res,
        400,
        "Invalid format for requirements or responsibilities"
      );
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      requirements: parsedRequirements || [],
      responsibilities: parsedResponsibilities || [],
      salaryRange: {
        min: parsedSalaryRange.min,
        max: parsedSalaryRange.max,
      },
      location,
      type,
      level,
      company: companyId,
      createdBy: req.user._id,
    });

    // Handle file upload if exists
    if (req.file) {
      try {
        // Upload to cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "job-descriptions",
          resource_type: "raw",
        });

        // Create file upload record
        await FileUpload.create({
          fileType: "jobDescription",
          url: result.secure_url,
          uploadedBy: req.user._id,
          job: job._id,
        });

        // Update job with file URL
        job.descriptionFile = result.secure_url;
        await job.save();
      } catch (error) {
        console.error("File upload failed:", error);
        // Continue without file if upload fails
      }
    }

    // Populate company and creator details
    await job.populate([
      { path: "company", select: "name location logo" },
      { path: "createdBy", select: "name email" },
    ]);

    successResponse(res, 201, "Job created successfully", job);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Get all jobs with filters and pagination
export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      company,
      type,
      level,
      location,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    const queryObject = {};

    // Add filters
    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (company) queryObject.company = company;
    if (type) queryObject.type = type;
    if (level) queryObject.level = level;
    if (location) queryObject.location = { $regex: location, $options: "i" };

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const jobs = await Job.find(queryObject)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate([
        { path: "company", select: "name location logo" },
        { path: "createdBy", select: "name email" },
      ]);

    // Get total count
    const totalJobs = await Job.countDocuments(queryObject);
    const totalPages = Math.ceil(totalJobs / Number(limit));

    successResponse(res, 200, "Jobs retrieved successfully", {
      jobs,
      currentPage: Number(page),
      totalPages,
      totalJobs,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Get single job
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate([
      { path: "company", select: "name location logo" },
      { path: "createdBy", select: "name email" },
    ]);

    if (!job) {
      return errorResponse(res, 404, "Job not found");
    }

    successResponse(res, 200, "Job retrieved successfully", job);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      salaryRange,
      location,
      type,
      level,
    } = req.body;

    const jobId = req.params.id;

    // Find job
    const job = await Job.findById(jobId);
    if (!job) {
      return errorResponse(res, 404, "Job not found");
    }

    // Parse salary range if it's sent as string
    let parsedSalaryRange = salaryRange;
    if (typeof salaryRange === "string") {
      try {
        parsedSalaryRange = JSON.parse(salaryRange);
      } catch (error) {
        return errorResponse(res, 400, "Invalid salary range format");
      }
    }

    // Parse arrays if they're sent as strings
    let parsedRequirements = requirements;
    let parsedResponsibilities = responsibilities;

    try {
      if (typeof requirements === "string") {
        parsedRequirements = JSON.parse(requirements);
      }
      if (typeof responsibilities === "string") {
        parsedResponsibilities = JSON.parse(responsibilities);
      }
    } catch (error) {
      return errorResponse(
        res,
        400,
        "Invalid format for requirements or responsibilities"
      );
    }

    // Prepare updates object
    const updates = {
      title: title || job.title,
      description: description || job.description,
      requirements: parsedRequirements || job.requirements,
      responsibilities: parsedResponsibilities || job.responsibilities,
      location: location || job.location,
      type: type || job.type,
      level: level || job.level,
    };

    // Update salary range if provided
    if (parsedSalaryRange && parsedSalaryRange.min && parsedSalaryRange.max) {
      if (parsedSalaryRange.min > parsedSalaryRange.max) {
        return errorResponse(
          res,
          400,
          "Minimum salary cannot be greater than maximum salary"
        );
      }
      updates.salaryRange = {
        min: parsedSalaryRange.min,
        max: parsedSalaryRange.max,
      };
    }

    // Handle file upload if exists
    if (req.file) {
      try {
        // Upload to cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "job-descriptions",
          resource_type: "raw", // This allows any file type
        });

        // Create file upload record
        await FileUpload.create({
          fileType: "jobDescription",
          url: result.secure_url,
          uploadedBy: req.user._id,
          job: jobId,
        });

        // Update job with new file URL
        updates.descriptionFile = result.secure_url;
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        return errorResponse(res, 500, "File upload failed");
      }
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "company", select: "name location logo" },
      { path: "createdBy", select: "name email" },
    ]);

    if (!updatedJob) {
      return errorResponse(res, 404, "Job not found");
    }

    successResponse(res, 200, "Job updated successfully", updatedJob);
  } catch (error) {
    console.error("Job update error:", error);
    errorResponse(res, 500, error.message || "Error updating job");
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return errorResponse(res, 404, "Job not found");
    }

    // Delete associated file uploads
    await FileUpload.deleteMany({ job: job._id });

    // Delete job
    await job.deleteOne();

    successResponse(res, 204, "Job deleted successfully", null);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
