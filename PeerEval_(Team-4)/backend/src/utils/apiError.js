// This file is responsible for handling API errors using the starndardized Error Class of Node.js //

class ApiError extends Error {
  constructor(
    message = "An unexpected error occurred!!!",
    statusCode = 500,
    error = [],
    stack = new Error().stack // Error stack is a built-in property of Error object which holds the call stack of the error //
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = error;
    this.stack = stack; // Setting the stack property of the error to the stack of the current Error object 

    if(stack){
        this.stack = stack;
    }
    else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;