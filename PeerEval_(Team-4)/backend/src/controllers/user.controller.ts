import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "./models/user.model.js";
import ApiResponse from "./utils/apiResponse.js";
import ApiError from "./utils/apiError.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

load_dotenv.config("./.env");
// // Simulated database (in-memory array)
// const users = [];

// /**
//  * Registers a new user by storing their email and password.
//  * @param {string} email - User's email address.
//  * @param {string} password - User's password.
//  * @returns {object} - The created user object.
//  */
// export const registerUser = (email, password) => {
//     // Basic validation
//     if (!email || !password) {
//         throw new Error("Email and password are required.");
//     }

//     // Check if user already exists
//     const existingUser = users.find(user => user.email === email);
//     if (existingUser) {
//         throw new Error("User already exists.");
//     }

//     // Store user (in a real app, hash the password before storing)
//     const newUser = { email, password };
//     users.push(newUser);

//     return newUser;
// };

// /**
//  * Authenticates a user and generates a JWT token if credentials are valid.
//  * @param {string} email - User's email address.
//  * @param {string} password - User's password.
//  * @returns {string} - JWT token.
//  */
// export const signInUser = (email, password) => {
//     // Basic validation
//     if (!email || !password) {
//         throw new Error("Email and password are required.");
//     }

//     // Find user in the database
//     const user = users.find(u => u.email === email && u.password === password);
//     if (!user) {
//         throw new Error("Invalid email or password.");
//     }

//     // Generate JWT token
//     const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1d" });
//     return token;
// };

// Example usage (remove or comment out in production)
/*
try {
    const user = registerUser("test@example.com", "password123");
    console.log("User registered:", user);

    const token = signInUser("test@example.com", "password123");
    console.log("JWT Token:", token);
} catch (error) {
    console.error("Error:", error.message);
}
*/

// Access and Refresh Token Generator
const generateAccessTokenAndRefreshToken = asyncHandler(async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found in the database.");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, {
      success: false,
      message:
        "Error in genrating access token and refresh token while finding the user from the database.",
    });
  }
});

// User Registration
const registerUser = asyncHandler(async (request, response) => {
  const {
    fullName = "", // Name uploaded by the user
    email = "", // Email uploaded by the user
    username = "", // Username uploaded by the user
    password = "", // Password uploaded by the user
  } = request.body;
  // TODO: Maybe user Zod or Zustand in future
  // Validation
  if (
    fullName?.trim() === "" ||
    email?.trim() === "" ||
    username?.trim() === "" ||
    password?.trim() === ""
  ) {
    throw new ApiError(400, {
      success: false,
      message: "All fields are required. User registration failed!!!",
    });
  }

  const existingUser = await User.findOne(
    {
      // Search for the user either by email or username //
      $or: [{ email }, { username }],
    },
    async (error, user) => {}
  );

  if (existingUser) {
    throw new ApiError(401, {
      success: false,
      message:
        "Email or username already exists. User is already registered. Please try to Login",
    });
  }

  // Extract the "avatar" & 'coverImage' from the files of the multer returned request object //
  const avatarLocalPath = request.files?.avatar?.[0]?.path;
  const coverImageLocalPath = request.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(402, {
      success: false,
      message: "Avatar and Cover Image is required.",
    });
  }

  // Upload 'avatar' & 'cover-image' to mongoDB or local storage //
  // TODO:

  // Create a new user instance //
  const newUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Being extra sure the user instance has been created and has a valid id //
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken" // Exclude the password and refreshToken from the response //
  );

  if (createdUser) {
    throw new ApiError(500, {
      success: false,
      message:
        "Error occured while creating a new user and saving to the database. User registration failed!!!",
    });
  }
  // Finally we can say that the user has been registered successfully //
  return response.json(
    new ApiResponse(200, createdUser, "User has been registered successfully.")
  );
});

// User Login
const loginUser = asyncHandler(async (request, response) => {
  const { email = "", password = "" } = request.body;
  // Validation
  if (email?.trim() === "" || password?.trim() === "") {
    throw new ApiError(400, {
      success: false,
      message: "All fields are required. User login failed!!!",
    });
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, {
      success: false,
      message: "User not found. User login failed!!!",
    });
  }

  // Validate password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, {
      success: false,
      message: "Password is incorrect. User login failed!!!",
    });
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    expiresIn: "7d", // 7 days
    httpOnly: true, // Accessible only through HTTP requests
    secure: process.env.NODE_ENV === "production", // Only set cookie when in production
  };
  response.cookie("access_token", accessToken, options);
  return response
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User has been logged in successfully."
      )
    );
});

// User automatic login using Refresh Token
const refreshAccessToken = asyncHandler(async (request, response) => {
  const incomingRefreshToken =
    request.cookies.refreshToken || request.body.refreshToken; // May come from Web or Mobile respectively //

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Need to Login Again. Refesh Token not found.");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken, // Refresh Token from the cookie
      process.env.JWT_SECRET // Secret key for JWT verification
    );

    const tokenUser = await User.findById(decodedToken?._id);

    if (!tokenUser) {
      throw new ApiError(
        404,
        "Error User not found. Refresh Token matched with no existing user."
      );
    }

    // If the refresh token sent by the user is already in the database then the user has logged in recently //
    if (incomingRefreshToken !== tokenUser?.refreshToken) {
      throw new ApiError(401, "Need to Login Again. User has been long gone!");
    }

    // If the user is found in the database and the refresh token is correct then generate new tokens //
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    // Generate new access token and refresh token //
    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(tokenUser._id);

    return response
      .status(200)
      .cookie("access_token", accessToken, options)
      .cookie("refresh_token", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token has been refreshed successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error occurred while refreshing access token.");
  }
});

// User Logout
const logoutUser = asyncHandler(async (request, response) => {
  await User.findByIdAndUpdate(
    request.user._id,
    { $set: { refreshToken: "" || null } },
    { new: true }
  );

  const options = {
    expiresIn: "0", // Session cookie expires when the browser is closed
    httpOnly: true, // Accessible only through HTTP requests
    secure: process.env.NODE_ENV === "production", // Only set cookie when in production
  };

  return response
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json(new ApiResponse(200, "User has been logged out successfully."));
});

// Change password
const changePassword = asyncHandler(async (request, response) => {
  const { oldPassword, newPassword } = request.body;

  const findUser = await User.findById(request.user?._id);

  if (!findUser) {
    throw new ApiError(404, "User not found.");
  }

  const isOldPasswordCorrect = await findUser.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect.");
  }

  findUser.password = newPassword;

  await findUser.save({
    validateBeforeSave: false,
  });

  return response
    .status(200)
    .json(
      new ApiResponse(200, findUser, "Password has been updated successfully.")
    );
});

// Get current user details
const getCurrentUser = asyncHandler(async (request: any, response: any) => {
  const getUser = await User.findById(
    request?.params.userId // Get the user whose details are requested from the route parameters. The user is stored in the currentUser property of the request object //
  );

  if (!getUser) {
    throw new ApiError(404, "User not found.");
  }

  return response
    .status(200)
    .json(new ApiResponse(200, getUser, "User details fetched successfully."));
});

// Update account details
const updateAccountDetails = asyncHandler(async (request, response) => {
  const userId = request.user?._id || request.userId || request.body.userId;
  if (!userId) {
    throw new ApiError(400, {
      success: false,
      message: "User ID is required.",
    });
  }

  // Extract required fields from request body
  const {
    userName,
    userEmail,
    userPhoneNumber,
    userLocation,
    userPassword,
    // Optional fields
    userBio,
    userProfileImage,
    userAcademicInformation,
    userSkills,
    userSocialMediaProfiles,
    userJoiningDate,
    userLastLogin,
    refreshToken,
  } = request.body;

  // Validate required fields
  if (
    !userName ||
    !userEmail ||
    !userPhoneNumber ||
    !userLocation ||
    !userPassword
  ) {
    throw new ApiError(400, {
      success: false,
      message:
        "userName, userEmail, userPhoneNumber, userLocation, and userPassword are required.",
    });
  }

  // Validate nested required fields
  if (!userPhoneNumber.countryCode) {
    throw new ApiError(400, {
      success: false,
      message: "countryCode is required in userPhoneNumber.",
    });
  }
  if (!userLocation.homeAddress || !userLocation.currentAddress) {
    throw new ApiError(400, {
      success: false,
      message: "homeAddress and currentAddress are required in userLocation.",
    });
  }

  // Prepare update object
  const updateFields = {
    userName,
    userEmail,
    userPhoneNumber,
    userLocation,
    userPassword,
  };

  // Add optional fields if provided
  if (userBio) updateFields.userBio = userBio;
  if (userProfileImage) updateFields.userProfileImage = userProfileImage;
  if (userAcademicInformation)
    updateFields.userAcademicInformation = userAcademicInformation;
  if (userSkills) updateFields.userSkills = userSkills;
  if (userSocialMediaProfiles)
    updateFields.userSocialMediaProfiles = userSocialMediaProfiles;
  if (userJoiningDate) updateFields.userJoiningDate = userJoiningDate;
  if (userLastLogin) updateFields.userLastLogin = userLastLogin;
  if (refreshToken) updateFields.refreshToken = refreshToken;

  // Update user in Database
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields }, // Update the document with the provided fields
    { new: true, runValidators: true } // Run validators before updating the document
  ).select("-userPassword -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, { success: false, message: "User not found." });
  }

  return response
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User details updated successfully.")
    );
});

// Update user avatar
// const updateUserAvatar = asyncHandler(async (request, response) => {});

// TODO: Implement a Aggregation Pipeline Logic for Analytics Page

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  // updateUserAvatar,
  // updateAccountDetails,
};
