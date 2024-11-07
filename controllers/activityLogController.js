import ActivityLog from "../models/ActivityLog.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";

// Get all activity logs with filtering and pagination
export const getActivityLogs = async (req, res) => {
  try {
    const {
      resource,
      action,
      startDate,
      endDate,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    // Build query object
    const queryObject = {};

    // Add filters
    if (resource) queryObject.resource = resource;
    if (action) queryObject.action = action;
    if (startDate || endDate) {
      queryObject.createdAt = {};
      if (startDate) queryObject.createdAt.$gte = new Date(startDate);
      if (endDate) queryObject.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const logs = await ActivityLog.find(queryObject)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate([
        { path: "userId", select: "name email" },
        { path: "resourceId", select: "name title email" },
      ]);

    // Get total count
    const totalLogs = await ActivityLog.countDocuments(queryObject);
    const totalPages = Math.ceil(totalLogs / Number(limit));

    successResponse(res, 200, "Activity logs retrieved successfully", {
      logs,
      currentPage: Number(page),
      totalPages,
      totalLogs,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Get activity logs for a specific resource
export const getResourceActivityLogs = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get logs for specific resource
    const logs = await ActivityLog.find({ resourceId })
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .populate([
        { path: "userId", select: "name email" },
        { path: "resourceId", select: "name title email" },
      ]);

    // Get total count
    const totalLogs = await ActivityLog.countDocuments({ resourceId });
    const totalPages = Math.ceil(totalLogs / Number(limit));

    successResponse(res, 200, "Resource activity logs retrieved successfully", {
      logs,
      currentPage: Number(page),
      totalPages,
      totalLogs,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
