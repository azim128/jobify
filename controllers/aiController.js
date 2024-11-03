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

    // Construct the prompt with explicit formatting instructions
    const prompt = `Generate a detailed job description for a ${experienceLevel} ${title} position in the ${industry} industry.

    Return ONLY a valid JSON object with the following structure, nothing else:
    {
      "description": "main job description",
      "responsibilities": ["array of responsibilities"],
      "requirements": ["array of requirements"],
      "preferredSkills": ["array of preferred skills"],
      "benefits": ["array of benefits"]
    }

    Include these details in the appropriate sections:
    - Location: ${location || "Remote"}
    - Employment Type: ${employmentType || "Full-time"}
    - Required Skills: ${skills.join(", ")}`;

    // Call OpenAI API with error handling
    let completion;
    try {
      completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a professional HR assistant skilled in writing job descriptions. You must respond with ONLY valid JSON, no additional text or formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }, // Force JSON response format
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

      throw apiError;
    }

    // Validate API response
    if (!completion?.choices?.[0]?.message?.content) {
      return errorResponse(res, 500, "Invalid response from AI service");
    }

    // Parse the response with better error handling
    let generatedContent;
    try {
      const responseText = completion.choices[0].message.content.trim();

      // Attempt to clean the response if it contains markdown code blocks
      const jsonString = responseText.replace(/```json\n?|\n?```/g, "").trim();

      generatedContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", completion.choices[0].message.content);
      return errorResponse(
        res,
        500,
        "Error parsing AI response. Please try again."
      );
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

    // Validate that arrays are actually arrays
    const arrayFields = [
      "responsibilities",
      "requirements",
      "preferredSkills",
      "benefits",
    ];
    const invalidArrays = arrayFields.filter(
      (field) => !Array.isArray(generatedContent[field])
    );

    if (invalidArrays.length > 0) {
      return errorResponse(
        res,
        500,
        `Invalid data types in response. Expected arrays for: ${invalidArrays.join(
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
