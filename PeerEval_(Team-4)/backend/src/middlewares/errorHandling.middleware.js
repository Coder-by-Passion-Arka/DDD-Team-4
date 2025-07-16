import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import logger from "../logger.js";

// Define the error handling middleware
const errorHandler = (err, request, response, next) => {
  let error = err;

  // Check if the error is not an instance of ApiError class
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);

    const message = error.message || "An unexpected error occurred";

    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  // Log the error to the logger file
  // logger.error("\n===========================\n");
  logger.error(`Error occurred at: ${new Date().toISOString()}\n`);
  logger.error(`Error: ${error.message}\n`);
  logger.error(`Error stack: ${error.stack}\n`);
  logger.error(
    `Error occurred while handling request: ${request.originalUrl}\n`
  );
  logger.error(`Request method: ${request.method}\n`);
  logger.error(`Request headers: ${JSON.stringify(request.headers)}\n`);
  logger.error(`Request body: ${JSON.stringify(request.body)}\n`);
  logger.error(`Response headers: ${JSON.stringify(response.getHeaders())}\n`);
  logger.error(`Response body: ${JSON.stringify(response.body)}`);
  // logger.error("\n===========================\n");

  // Log the error to the console
  console.error(`Error: ${error.message}`);
  console.error(`Error stack: ${error.stack}`);
  console.error(
    `Error occurred while handling request: ${request.originalUrl}`
  );

  const responseData = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      errors: error.errors,
    }),
  };

  return response.status(error.statusCode || 500).json(responseData);
};

export default errorHandler;
