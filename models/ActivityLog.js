import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["create", "update", "delete", "login", "logout"],
      required: true,
    },
    resource: {
      type: String,
      enum: ["user", "company", "job"],
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "resource",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
