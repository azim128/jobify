import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import { generateAIJobDescription } from "../services/aiService.js";

export const generateJobDescription = async (req, res) => {
  try {
    const {
      title,
      industry,
      experienceLevel,
      skills,
      location,
      employmentType,
    } = req.body;

    // Validate required fields
    if (!title || !industry || !experienceLevel) {
      return errorResponse(
        res,
        400,
        "Please provide job title, industry, and experience level"
      );
    }

    // Generate job description using AI service
    const result = await generateAIJobDescription({
      title,
      industry,
      experienceLevel,
      skills,
      location,
      employmentType,
    });

    return successResponse(
      res,
      200,
      "Job description generated successfully",
      result
    );
  } catch (error) {
    console.error("AI Generation Error:", error);
    return errorResponse(
      res,
      500,
      error.message ||
        "Error generating job description. Please try again later."
    );
  }
};
