import openai from "../config/openaiConfig.js";
import {
  buildJobDescriptionPrompt,
  getSystemPrompt,
} from "../utils/aiPromptBuilder.js";
import {
  parseAIResponse,
  validateAIResponse,
} from "../utils/aiResponseParser.js";

export const generateAIJobDescription = async (jobData) => {
  try {
    // Build the prompt
    const prompt = buildJobDescriptionPrompt(jobData);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [getSystemPrompt(), { role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    // Validate API response
    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from AI service");
    }

    // Parse and validate the response
    const responseText = completion.choices[0].message.content.trim();
    const parsedContent = parseAIResponse(responseText);
    const validatedContent = validateAIResponse(parsedContent);

    return {
      jobDescription: validatedContent,
      usage: completion.usage,
    };
  } catch (error) {
    handleAIError(error);
  }
};

const handleAIError = (error) => {
  if (error.status === 401) {
    throw new Error("Invalid API key configuration");
  }

  if (error.status === 429) {
    throw new Error("Rate limit exceeded. Please try again later");
  }

  if (error.code === "ECONNREFUSED") {
    throw new Error(
      "Could not connect to AI service. Please check your internet connection"
    );
  }

  throw error;
};
