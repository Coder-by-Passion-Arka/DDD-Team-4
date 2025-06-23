import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "express-async-handler";

export const verifyJWT = asyncHandler(
  async (
    request, // From one endpoint
    response, // we won't be needing this as middleware won't create a brand new response object
    next // Next endpoint
  ) => {
    const token =
      request.cookies.access_token ||
      request.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized, Access token is required");
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret"
      );

      const foundUser = await User.findById(decodedToken?._id).select(
        "-userPassword -refreshToken"
      );

      if (!foundUser) {
        throw new ApiError(401, "Unauthorized, User not found");
      }

      request.user = foundUser;
      next();
    } catch (error) {
      throw new ApiError(
        401,
        error?.message || "Unauthorized, Invalid access token"
      );
    }
  }
);

// Middleware to verify admin role
export const verifyAdmin = asyncHandler(async (request, response, next) => {
  if (request.user?.userRole !== "admin") {
    throw new ApiError(403, "Access denied. Admin privileges required.");
  }
  next();
});

// Middleware to verify teacher role
export const verifyTeacher = asyncHandler(async (request, response, next) => {
  if (!["admin", "teacher"].includes(request.user?.userRole)) {
    throw new ApiError(403, "Access denied. Teacher privileges required.");
  }
  next();
});
