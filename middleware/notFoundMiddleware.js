import { errorResponse } from "../helpers/responseHelper.js";

const notFoundMiddleware = (_req, res, _next) => {
  errorResponse(res, 404, "Route not found");
};

export default notFoundMiddleware;
