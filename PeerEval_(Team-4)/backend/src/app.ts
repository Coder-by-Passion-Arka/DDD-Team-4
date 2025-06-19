import express from "express";
import server from "./server";
import connectDB from "./db/index";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./.env" });

// Get the port from environment variables or default to 5000
const port: number = parseInt(process.env.PORT || "5000", 10);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`✅ Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: any) => {
    console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  });
