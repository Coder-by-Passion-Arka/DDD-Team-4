import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

// Define the error handing middleware
const errorHandler = (error, request, response, next) => {
  let error = error;

  // Check if the Errors are not a part of ApiError class //
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "An unexpected error occurred";
    error = new ApiError(
      statusCode, // status code of the error is stored
      message,
      error?.errors || [],
      error.stack // Error stack of the error is stored
    );
  }

  const response = {
    ...error,
    success: false,
    message: error.message || "An unexpected error occurred",
    ...(process.env.NODE_ENV === "development"
      ? {
          stack: error.stack,
        }
      : {}),
  };

  return response.status(error.statusCode).json(response);
};

export default errorHandler;
