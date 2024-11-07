const validateRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `Please provide the ${field} field.`;
    }
  }
  return null;
};

export default validateRequiredFields;
