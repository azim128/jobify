export const parseSalaryRange = (salaryRange) => {
  if (typeof salaryRange === "string") {
    try {
      return JSON.parse(salaryRange);
    } catch (error) {
      throw new Error("Invalid salary range format");
    }
  }
  return salaryRange;
};

export const parseArrayField = (field, fieldName) => {
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch (error) {
      throw new Error(`Invalid format for ${fieldName}`);
    }
  }
  return field;
};

export const validateSalaryRange = (salaryRange) => {
  if (!salaryRange?.min || !salaryRange?.max) {
    throw new Error("Please provide valid salary range");
  }
  if (salaryRange.min > salaryRange.max) {
    throw new Error("Minimum salary cannot be greater than maximum salary");
  }
  return salaryRange;
};
