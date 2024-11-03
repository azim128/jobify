import Job from "../models/Job.js";
import Company from "../models/Company.js";
import {
  uploadFileToCloudinary,
  createFileUploadRecord,
} from "./fileService.js";

export const createJobService = async (jobData, userId, file = null) => {
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
  } = jobData;

  // Check if company exists
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Create job
  const job = await Job.create({
    title,
    description,
    requirements,
    responsibilities,
    salaryRange,
    location,
    type,
    level,
    company: companyId,
    createdBy: userId,
  });

  // Handle file upload if exists
  if (file) {
    const fileUrl = await uploadFileToCloudinary(file, "job-descriptions");
    await createFileUploadRecord({
      fileType: "jobDescription",
      url: fileUrl,
      uploadedBy: userId,
      job: job._id,
    });

    job.descriptionFile = fileUrl;
    await job.save();
  }

  // Populate references
  await job.populate([
    { path: "company", select: "name location logo" },
    { path: "createdBy", select: "name email" },
  ]);

  return job;
};

export const getJobsService = async (filters, pagination) => {
  const {
    search,
    company,
    type,
    level,
    location,
    sort = "-createdAt",
  } = filters;
  const { page = 1, limit = 10 } = pagination;

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

  return {
    jobs,
    currentPage: Number(page),
    totalPages,
    totalJobs,
  };
};

export const updateJobService = async (
  jobId,
  updateData,
  userId,
  file = null
) => {
  // Find job
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  // Handle file upload if exists
  if (file) {
    const fileUrl = await uploadFileToCloudinary(file, "job-descriptions");
    await createFileUploadRecord({
      fileType: "jobDescription",
      url: fileUrl,
      uploadedBy: userId,
      job: jobId,
    });
    updateData.descriptionFile = fileUrl;
  }

  // Update job
  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  }).populate([
    { path: "company", select: "name location logo" },
    { path: "createdBy", select: "name email" },
  ]);

  return updatedJob;
};

export const deleteJobService = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  // Delete associated file uploads
  await FileUpload.deleteMany({ job: jobId });

  // Delete job
  await job.deleteOne();
};

export const getJobByIdService = async (jobId) => {
  const job = await Job.findById(jobId).populate([
    { path: "company", select: "name location logo" },
    { path: "createdBy", select: "name email" },
  ]);

  if (!job) {
    const error = new Error("Job not found");
    error.status = 404;
    throw error;
  }

  return job;
};
