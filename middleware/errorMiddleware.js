import { errorResponse } from "../helpers/responseHelper.js";

const errorMiddleware = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";
  errorResponse(res, statusCode, message);
};

export default errorMiddleware;
