const successResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({ status: "success", statusCode, message, data });
};

const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ status: "fail", statusCode, message });
};

export { successResponse, errorResponse };
