import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import {
  createJobService,
  getJobsService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
} from "../services/jobService.js";
import {
  parseSalaryRange,
  parseArrayField,
  validateSalaryRange,
} from "../utils/dataParser.js";
import validateRequiredFields from "../utils/validateRequiredFields.js";

export const createJob = async (req, res) => {
  try {
    const requiredFields = [
      "title",
      "description",
      "companyId",
      "type",
      "level",
    ];

    // Validate required fields
    const errorMessage = validateRequiredFields(req.body, requiredFields);
    if (errorMessage) {
      return errorResponse(res, 400, errorMessage);
    }

    // Parse and validate data
    const parsedSalaryRange = validateSalaryRange(
      parseSalaryRange(req.body.salaryRange)
    );
    const parsedRequirements = parseArrayField(
      req.body.requirements,
      "requirements"
    );
    const parsedResponsibilities = parseArrayField(
      req.body.responsibilities,
      "responsibilities"
    );

    // Prepare job data
    const jobData = {
      ...req.body,
      salaryRange: parsedSalaryRange,
      requirements: parsedRequirements,
      responsibilities: parsedResponsibilities,
    };

    const job = await createJobService(jobData, req.user._id, req.file);
    successResponse(res, 201, "Job created successfully", job);
  } catch (error) {
    errorResponse(res, error.status || 500, error.message);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const result = await getJobsService(req.query, {
      page: req.query.page,
      limit: req.query.limit,
    });
    successResponse(res, 200, "Jobs retrieved successfully", result);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateJob = async (req, res) => {
  try {
    // Parse and validate data
    const parsedSalaryRange = req.body.salaryRange
      ? validateSalaryRange(parseSalaryRange(req.body.salaryRange))
      : undefined;
    const parsedRequirements = req.body.requirements
      ? parseArrayField(req.body.requirements, "requirements")
      : undefined;
    const parsedResponsibilities = req.body.responsibilities
      ? parseArrayField(req.body.responsibilities, "responsibilities")
      : undefined;

    // Prepare update data
    const updateData = {
      ...req.body,
      ...(parsedSalaryRange && { salaryRange: parsedSalaryRange }),
      ...(parsedRequirements && { requirements: parsedRequirements }),
      ...(parsedResponsibilities && {
        responsibilities: parsedResponsibilities,
      }),
    };

    const updatedJob = await updateJobService(
      req.params.id,
      updateData,
      req.user._id,
      req.file
    );
    successResponse(res, 200, "Job updated successfully", updatedJob);
  } catch (error) {
    errorResponse(res, error.status || 500, error.message);
  }
};

export const deleteJob = async (req, res) => {
  try {
    await deleteJobService(req.params.id);
    successResponse(res, 204, "Job deleted successfully", null);
  } catch (error) {
    errorResponse(res, error.status || 500, error.message);
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await getJobByIdService(req.params.id);
    successResponse(res, 200, "Job retrieved successfully", job);
  } catch (error) {
    errorResponse(res, error.status || 500, error.message);
  }
};
