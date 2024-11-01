import mongoose from "mongoose";

const FileUploadSchema = new mongoose.Schema(
  {
    fileType: {
      type: String,
      enum: ["logo", "jobDescription"],
      required: true,
    },
    url: {
      type: String,
      required: [true, "File URL is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  },
  { timestamps: true }
);

const FileUpload = mongoose.model("FileUpload", FileUploadSchema);

export default FileUpload;
