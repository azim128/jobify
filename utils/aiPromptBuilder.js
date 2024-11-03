// Build AI prompts for different purposes
export const buildJobDescriptionPrompt = ({
  title,
  industry,
  experienceLevel,
  skills = [],
  location,
  employmentType,
}) => {
  return `Generate a detailed job description for a ${experienceLevel} ${title} position in the ${industry} industry.

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
};

export const getSystemPrompt = () => {
  return {
    role: "system",
    content:
      "You are a professional HR assistant skilled in writing job descriptions. You must respond with ONLY valid JSON, no additional text or formatting.",
  };
};
