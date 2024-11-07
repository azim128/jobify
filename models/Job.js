import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true }, // Array of strings
    responsibilities: { type: [String], required: true },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    location: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: String, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    descriptionFile: { type: String },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;
