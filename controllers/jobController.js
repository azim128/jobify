import Job from "../models/Job.js";
import Company from "../models/Company.js";
import FileUpload from "../models/FileUpload.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import cloudinary from "../config/cloudinaryConfig.js";

// Create job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      salaryRange, // Make sure you destructure this correctly
      location,
      type,
      level,
      companyId,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !companyId ||
      !salaryRange ||
      salaryRange.min === undefined ||
      salaryRange.max === undefined
    ) {
      return errorResponse(res, 400, "Please provide all required fields");
    }

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return errorResponse(res, 404, "Company not found");
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      salaryRange: {
        // Ensure you are correctly setting this
        min: salaryRange.min,
        max: salaryRange.max,
      },
      location,
      type,
      level,
      company: companyId,
      createdBy: req.user._id,
    });

    // Other code to handle file uploads and responses
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
      salary,
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

    // Update basic fields
    const updates = {
      title: title || job.title,
      description: description || job.description,
      requirements: requirements || job.requirements,
      responsibilities: responsibilities || job.responsibilities,
      salary: salary || job.salary,
      location: location || job.location,
      type: type || job.type,
      level: level || job.level,
    };

    // If new description file exists, upload to cloudinary
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
          job: jobId,
        });

        // Update job with new file URL
        updates.descriptionFile = result.secure_url;
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "company", select: "name location logo" },
      { path: "createdBy", select: "name email" },
    ]);

    successResponse(res, 200, "Job updated successfully", updatedJob);
  } catch (error) {
    errorResponse(res, 500, error.message);
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
