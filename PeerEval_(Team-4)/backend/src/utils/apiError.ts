// This file is responsible for handling API errors using the standardized Error class of Node.js

class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  error: any[];

  constructor(
    message: string = "An unexpected error occurred!!!",
    statusCode: number = 500,
    error: any[] = [],
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
