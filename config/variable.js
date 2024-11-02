import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Environment variables with validation
const variables = {
  PORT: process.env.PORT || 5000,
  // MongoDB Configuration
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "jobify",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,

  // Cloudinary Configuration
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Email Configuration
  smtp: {
    server: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    fromEmail: process.env.SMTP_FROM_EMAIL,
    fromName: process.env.SMTP_FROM_NAME || "Jobify Admin",
  },

  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default variables;
