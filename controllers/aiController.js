import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import openai from "../config/openaiConfig.js";

export const generateJobDescription = async (req, res) => {
  try {
    const {
      title,
      industry,
      experienceLevel,
      skills = [],
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

    // Construct the prompt
    const prompt = `Generate a detailed job description for a ${experienceLevel} ${title} position in the ${industry} industry.
    
    Include the following sections:
    1. About the Role
    2. Key Responsibilities
    3. Required Qualifications
    4. Preferred Skills
    5. Benefits and Perks

    Additional details:
    - Location: ${location || "Remote"}
    - Employment Type: ${employmentType || "Full-time"}
    - Required Skills: ${skills.join(", ")}

    Format the response in JSON with the following structure:
    {
      "description": "main job description",
      "responsibilities": ["array of responsibilities"],
      "requirements": ["array of requirements"],
      "preferredSkills": ["array of preferred skills"],
      "benefits": ["array of benefits"]
    }`;

    // Call OpenAI API with error handling
    let completion;
    try {
      completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a professional HR assistant skilled in writing job descriptions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000,
      });
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError);

      if (apiError.status === 401) {
        return errorResponse(res, 500, "Invalid API key configuration");
      }

      if (apiError.status === 429) {
        return errorResponse(
          res,
          500,
          "Rate limit exceeded. Please try again later"
        );
      }

      throw apiError; // Re-throw for general error handling
    }

    // Validate API response
    if (!completion?.choices?.[0]?.message?.content) {
      return errorResponse(res, 500, "Invalid response from AI service");
    }

    // Parse the response with error handling
    let generatedContent;
    try {
      generatedContent = JSON.parse(
        completion.choices[0].message.content.trim()
      );
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return errorResponse(res, 500, "Error parsing AI response");
    }

    // Validate the parsed content structure
    const requiredFields = [
      "description",
      "responsibilities",
      "requirements",
      "preferredSkills",
      "benefits",
    ];
    const missingFields = requiredFields.filter(
      (field) => !generatedContent[field]
    );

    if (missingFields.length > 0) {
      return errorResponse(
        res,
        500,
        `Invalid AI response structure. Missing fields: ${missingFields.join(
          ", "
        )}`
      );
    }

    return successResponse(res, 200, "Job description generated successfully", {
      jobDescription: generatedContent,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);

    // Provide more specific error messages based on the error type
    if (error.code === "ECONNREFUSED") {
      return errorResponse(
        res,
        500,
        "Could not connect to AI service. Please check your internet connection"
      );
    }

    return errorResponse(
      res,
      500,
      "Error generating job description. Please try again later."
    );
  }
};
