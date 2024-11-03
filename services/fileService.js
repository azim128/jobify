import cloudinary from "../config/cloudinaryConfig.js";
import FileUpload from "../models/FileUpload.js";

export const uploadFileToCloudinary = async (file, folder) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder,
      resource_type: "raw",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("File upload failed");
  }
};

export const createFileUploadRecord = async (fileData) => {
  try {
    return await FileUpload.create(fileData);
  } catch (error) {
    console.error("File record creation failed:", error);
    throw new Error("Failed to create file record");
  }
};
