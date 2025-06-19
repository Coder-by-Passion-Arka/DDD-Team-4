import jwt from "jsonwebtoken";
import { User } from "./models/user.model";
import ApiError from "./utils/apiError";
import asyncHandler from "express-async-handler";

export const verifyJWT = asyncHandler(
  async (
    request, // From one endpoint
    response, // we won't be needing this as middleware won't create a brand new response object
    next // Next endpoint
  ) => {
    const token =
      request.cookies.accessToken ||
      request.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized, Access token is required");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const foundUser = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
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
