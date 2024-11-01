import mongoose from "mongoose";
import variables from "./variable.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${variables.MONGO_URI}/${variables.DB_NAME}`);
    console.log(`MongoDB connected to ${variables.DB_NAME}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
