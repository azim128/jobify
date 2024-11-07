import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    logo: {
      type: String,
      default: null,
    },
    industry: {
      type: String,
      required: [true, "Industry type is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required"],
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);

export default Company;
