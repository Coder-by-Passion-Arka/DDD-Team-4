import express from "express";
import server from "./server.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

// Connect to dummy MongoDB Cluster //
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log("Connected to MongoDB successfully."); // If successful, print this message.  //
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  });
