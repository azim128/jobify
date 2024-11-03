import ActivityLog from "../models/ActivityLog.js";

export const getActivityLogsService = async (filters, pagination) => {
  const { resource, action, startDate, endDate, sort = "-createdAt" } = filters;
  const { page = 1, limit = 10 } = pagination;

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

  return {
    logs,
    currentPage: Number(page),
    totalPages,
    totalLogs,
  };
};

export const getResourceActivityLogsService = async (
  resourceId,
  pagination
) => {
  const { page = 1, limit = 10 } = pagination;

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

  return {
    logs,
    currentPage: Number(page),
    totalPages,
    totalLogs,
  };
};
