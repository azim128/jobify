import variables from "./variable.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: variables.cloudinary.cloud_name,
  api_key: variables.cloudinary.api_key,
  api_secret: variables.cloudinary.api_secret,
});

export default cloudinary;
