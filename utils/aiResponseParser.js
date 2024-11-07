// Parse and validate AI responses
export const parseAIResponse = (responseText) => {
  // Clean the response if it contains markdown code blocks
  const jsonString = responseText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(jsonString);
};

export const validateAIResponse = (content) => {
  // Required fields in the response
  const requiredFields = [
    "description",
    "responsibilities",
    "requirements",
    "preferredSkills",
    "benefits",
  ];

  // Check for missing fields
  const missingFields = requiredFields.filter((field) => !content[field]);
  if (missingFields.length > 0) {
    throw new Error(
      `Invalid AI response structure. Missing fields: ${missingFields.join(
        ", "
      )}`
    );
  }

  // Validate arrays
  const arrayFields = [
    "responsibilities",
    "requirements",
    "preferredSkills",
    "benefits",
  ];
  const invalidArrays = arrayFields.filter(
    (field) => !Array.isArray(content[field])
  );
  if (invalidArrays.length > 0) {
    throw new Error(
      `Invalid data types in response. Expected arrays for: ${invalidArrays.join(
        ", "
      )}`
    );
  }

  return content;
};
