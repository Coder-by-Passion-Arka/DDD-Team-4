// This file connects the backend to the database //
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from.env file //
dotenv.config();

// Connect to MongoDB //
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
    console.log(
      "\nConnected to MongoDB successfully\n",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error(`Faced error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
