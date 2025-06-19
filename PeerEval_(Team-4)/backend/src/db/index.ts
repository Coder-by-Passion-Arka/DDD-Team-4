import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define types for process.env
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI || !DB_NAME) {
  throw new Error("MONGO_URI or DB_NAME is missing in environment variables.");
}

// Function to connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(
      "\n✅ Connected to MongoDB successfully\n",
      `Host: ${connectionInstance.connection.host}`
    );
  } catch (error: any) {
    console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
