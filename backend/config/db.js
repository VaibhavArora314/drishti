import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const baseUrl = process.env.MONGODB;
console.log(baseUrl)
export const connectToDb = async () => {
  try {
    await mongoose.connect(`${baseUrl}`);
    console.log("MongoDB connected using mongoose");
  } catch (err) {
    console.error(err);
  }
};