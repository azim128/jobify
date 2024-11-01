import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: String,
      required: [true, "Requirements are required"],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
    },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required"],
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["open", "closed", "paused"],
      default: "open",
    },
    isAIgenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;
