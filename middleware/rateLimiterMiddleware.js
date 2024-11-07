import rateLimit from "express-rate-limit";
import { errorResponse } from "../helpers/responseHelper.js";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (_req, res) => {
    errorResponse(
      res,
      429,
      "Too many requests from this IP, please try again later."
    );
  },
});
