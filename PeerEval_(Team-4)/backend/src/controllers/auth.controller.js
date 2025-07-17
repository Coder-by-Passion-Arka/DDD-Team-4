// 1. Frontend sends Google credential
// 2. googleAuth.service.js verifies credential with Google
// 3. Extracts user info (email, name, etc.)
// 4. Creates/updates user in database
// 5. Returns JWT tokens to frontend

import asyncHandler from "express-async-handler";
import User from "../models/user.models.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { verifyGoogleToken } from "../services/googleAuth.service.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: "src/.env" });

// Valid user roles
const VALID_ROLES = ["student", "teacher", "admin"];

// Access and Refresh Token Generator
const generateAccessTokenAndRefreshToken = asyncHandler(async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found in the database.");
    }

    console.log(`Generating tokens using User document methods\n`);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    console.log("Inside the generateAccessAndRefreshToken function");
    console.log(" ====================================================== ");
    console.log(`✅ Tokens generated for user: ${user.userName}\n`);
    console.log(`Access Token: ${accessToken}\n`);
    console.log(`Refresh Token: ${refreshToken}\n`);
    console.log(" ====================================================== ");

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("❌ Token generation error:", error);
    throw new ApiError(
      500,
      "Error in generating access token and refresh token."
    );
  }
});

// Helper function to validate user role
const validateUserRole = (role) => {
  if (!role) {
    return false;
  }
  return VALID_ROLES.includes(role.toLowerCase());
};

// Google OAuth Login/Register
const googleAuth = asyncHandler(async (request, response) => {
  console.log(
    "......Inside the googleAuth function of auth.controller.js......"
  ); 
  const { credential } = request.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  try {
    const googleUser = await verifyGoogleToken(credential);

    if (!googleUser) {
      throw new ApiError(401, "Invalid Google credential");
    }

    // Destructure the response sent by verifyGoogleToken function in googleAuth.service
    const { email, name, picture, email_verified, google_id } = googleUser;

    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { userEmail: email.toLowerCase() },
        { "metadata.googleId": google_id },
      ],
    });

    if (user) {
      // User exists, log them in
      if (!user.isActive) {
        throw new ApiError(403, "Account deactivated. Contact support.");
      }

      // Update user info
      user.userLastLogin = new Date();
      if (!user.metadata.googleId && google_id) {
        user.metadata.googleId = google_id;
      }
      if (!user.userProfileImage && picture) {
        user.userProfileImage = picture;
      }
      if (email_verified && !user.isEmailVerified) {
        user.isEmailVerified = true;
      }

      await user.save({ validateBeforeSave: false });

      const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
      const loggedInUser = await User.findById(user._id).select(
        "-userPassword -refreshToken"
      );

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      return response
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
              needsProfileCompletion: false,
            },
            "Google login successful."
          )
        );
    } else {
      // Create new user
      const newUser = await User.create({
        userName: name,
        userEmail: email.toLowerCase(),
        userProfileImage: picture || "",
        isEmailVerified: email_verified || false,
        metadata: {
          googleId: google_id,
          authProvider: "google",
          accountSource: "google",
        },
        isActive: true,
        userRole: "student",
        userPhoneNumber: "",
        countryCode: "",
        userLocation: {
          homeAddress: "",
          currentAddress: "",
        },
      });

      const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(newUser._id);
      const createdUser = await User.findById(newUser._id).select(
        "-userPassword -refreshToken"
      );

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      return response
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            201,
            {
              user: createdUser,
              accessToken,
              refreshToken,
              needsProfileCompletion: true,
            },
            "Google registration successful. Please complete your profile."
          )
        );
    }
  } catch (error) {
    console.error("❌ Google auth error:", error);
    throw new ApiError(500, "Google authentication failed");
  }
});

// Complete Social Profile
const completeSocialProfile = asyncHandler(async (request, response) => {
  const userId = request.user?._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  const {
    userPhoneNumber,
    countryCode,
    userLocation,
    userRole,
    userBio,
    userAcademicInformation,
    userSkills,
    userSocialMediaProfiles,
  } = request.body;

  if (!userPhoneNumber || !countryCode || !userLocation || !userRole) {
    throw new ApiError(
      400,
      "Phone number, country code, location, and role are required"
    );
  }

  if (!validateUserRole(userRole)) {
    throw new ApiError(
      400,
      "Invalid user role. Must be student, teacher, or admin."
    );
  }

  const updateFields = {
    userPhoneNumber: userPhoneNumber.trim(),
    countryCode: countryCode.trim(),
    userLocation,
    userRole: userRole.toLowerCase(),
  };

  if (userBio) updateFields.userBio = userBio.trim();
  if (userAcademicInformation)
    updateFields.userAcademicInformation = userAcademicInformation;
  if (userSkills) updateFields.userSkills = userSkills;
  if (userSocialMediaProfiles)
    updateFields.userSocialMediaProfiles = userSocialMediaProfiles;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-userPassword -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found.");
  }

  return response
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "Social profile completed successfully."
      )
    );
});

// User Registration
const registerUser = asyncHandler(async (request, response) => {
  let {
    userName = "",
    userEmail = "",
    userPhoneNumber = "",
    countryCode = "",
    userPassword = "",
    userRole = "student",
    userBio = "",
    userLocation = {
      homeAddress: "",
      currentAddress: "",
    },
    userAcademicInformation = {},
    userSkills = [],
    userSocialMediaProfiles = [],
  } = request.body;

  // Handle userLocation if it comes as a string (from form data)
  if (typeof userLocation === "string") {
    try {
      userLocation = JSON.parse(userLocation);
    } catch (parseError) {
      const homeAddressMatch = userLocation.match(
        /"homeAddress"\s*:\s*"([^"]+)"/
      );
      const currentAddressMatch = userLocation.match(
        /"currentAddress"\s*:\s*"([^"]+)"/
      );

      userLocation = {
        homeAddress: homeAddressMatch ? homeAddressMatch[1] : "",
        currentAddress: currentAddressMatch ? currentAddressMatch[1] : "",
      };
    }
  }

  // Parse other JSON fields
  try {
    if (typeof userAcademicInformation === "string") {
      userAcademicInformation = JSON.parse(userAcademicInformation);
    }
    if (typeof userSkills === "string") {
      userSkills = JSON.parse(userSkills);
    }
    if (typeof userSocialMediaProfiles === "string") {
      userSocialMediaProfiles = JSON.parse(userSocialMediaProfiles);
    }
  } catch (parseError) {
    console.warn("⚠️  JSON parsing failed for some fields, using defaults");
  }

  // Validate and normalize user role
  if (!validateUserRole(userRole)) {
    throw new ApiError(
      400,
      "Invalid user role. Must be student, teacher, or admin."
    );
  }
  userRole = userRole.toLowerCase();

  // DEBUG: Log extracted fields
  console.log("🔍 Registration attempt:");
  console.log("  userName:", `"${userName}"`);
  console.log("  userEmail:", `"${userEmail}"`);
  console.log("  userPhoneNumber:", `"${userPhoneNumber}"`);
  console.log("  countryCode:", `"${countryCode}"`);
  console.log("  userRole:", `"${userRole}"`);
  console.log(
    "  userPassword:",
    userPassword ? "***provided***" : "***MISSING***"
  );
  console.log("  userLocation:", JSON.stringify(userLocation, null, 2));

  // Enhanced Validation
  const validationErrors = [];

  if (!userName?.trim()) validationErrors.push("Full name is required");
  if (!userEmail?.trim()) {
    validationErrors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      validationErrors.push("Please provide a valid email address");
    }
  }
  if (!userPhoneNumber?.trim())
    validationErrors.push("Phone number is required");
  if (!countryCode?.trim()) validationErrors.push("Country code is required");
  if (!userPassword?.trim()) {
    validationErrors.push("Password is required");
  } else if (userPassword.length < 8) {
    validationErrors.push("Password must be at least 8 characters long");
  }
  if (!userLocation?.homeAddress?.trim())
    validationErrors.push("Home address is required");
  if (!userLocation?.currentAddress?.trim())
    validationErrors.push("Current address is required");

  if (validationErrors.length > 0) {
    throw new ApiError(
      400,
      `Validation failed: ${validationErrors.join(", ")}`
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      { userEmail: userEmail.toLowerCase() },
      { userName: userName.trim() },
    ],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User with this email or username already exists. Please try to Login"
    );
  }

  // Handle file uploads
  let userProfileImagePath = "";
  let userCoverImagePath = "";

  if (request.files?.avatar?.[0]) {
    const avatarResult = await uploadOnCloudinary(request.files.avatar[0].path);
    userProfileImagePath = avatarResult?.url || "";
  }

  if (request.files?.coverImage?.[0]) {
    const coverImageResult = await uploadOnCloudinary(
      request.files.coverImage[0].path
    );
    userCoverImagePath = coverImageResult?.url || "";
  }

  // Create user (ONLY ONCE!)
  const newUser = await User.create({
    userName: userName.trim(),
    userEmail: userEmail.trim().toLowerCase(),
    userPassword,
    userPhoneNumber: userPhoneNumber.trim(),
    countryCode: countryCode.trim(),
    userRole: userRole,
    userLocation: userLocation,
    userBio: userBio?.trim() || "",
    userProfileImage: userProfileImagePath,
    userCoverImage: userCoverImagePath,
    userAcademicInformation: userAcademicInformation || {},
    userSkills: Array.isArray(userSkills) ? userSkills : [],
    userSocialMediaProfiles: Array.isArray(userSocialMediaProfiles)
      ? userSocialMediaProfiles
      : [],
  });

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(newUser._id);

  // Get user without sensitive fields
  const createdUser = await User.findById(newUser._id).select(
    "-userPassword -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "User registration failed - could not retrieve created user."
    );
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };

  // Check if profile completion is needed (for regular registration, usually false since they provided all details)
  const needsProfileCompletion = false; // Regular registration includes all required fields

  console.log("User registered successfully:", createdUser.userName);

  return response
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
          accessToken,
          refreshToken,
          needsProfileCompletion,
        },
        "User has been registered successfully."
      )
    );
});

// User Login - FIXED VERSION
const loginUser = asyncHandler(async (request, response) => {
  const { userEmail = "", userPassword = "" } = request.body;

  console.log("🔍 Login attempt for:", userEmail);

  // Validation
  if (userEmail?.trim() === "" || userPassword?.trim() === "") {
    throw new ApiError(400, "Email and password are required.");
  }

  try {
    // Use findByCredentials which handles password validation and account locking
    const user = await User.findByCredentials(
      userEmail.toLowerCase().trim(),
      userPassword
    );

    // Generate tokens
    const { accessToken, refreshToken } =
      await
      generateAccessTokenAndRefreshToken(user._id);

    // Update last login
    user.userLastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Get user data without sensitive fields
    const loggedInUser = await User.findById(user._id).select(
      "-userPassword -refreshToken"
    );

    // // Check if the user is in the database otherwise redirect to the registration page
    // if (!loggedInUser) {
    //   console.log(`User ${userEmail} not registered in the database. Register and then try again.`);
    //   return response.redirect("/register");
    // }

    // Set the Access and Refresh tokens to the LoggedInUser
    loggedInUser.accessToken = accessToken;
    loggedInUser.refreshToken = refreshToken;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    // Consoling User Details
    console.log("Inside the loginUser function");
    console.log(" ====================================================== ");

    console.log("User logged in successfully:", loggedInUser.userName,"\n");
    console.log(`User Email: ${loggedInUser.userEmail}\n`);
    console.log(`User Role: ${loggedInUser.userRole}\n`);
    console.log(`User Phone Number: ${loggedInUser.countryCode} ${loggedInUser.userPhoneNumber}\n`);
    console.log(`User Location: ${loggedInUser.userLocation.homeAddress}, ${loggedInUser.userLocation.currentAddress}\n`);
    console.log(`User Bio: ${loggedInUser.userBio}\n`);
    console.log(`User logged in at: ${loggedInUser.userLastLogin}\n`);
    console.log(`Refresh Token: ${loggedInUser.refreshToken}\n`);
    console.log(`Access Token: ${loggedInUser.accessToken}\n`);

    console.log(" ====================================================== ");

    // Check if profile completion is needed
    const needsProfileCompletion =
      !loggedInUser.userPhoneNumber ||
      !loggedInUser.userLocation?.homeAddress ||
      !loggedInUser.userLocation?.currentAddress;

    return response
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
            needsProfileCompletion,
          },
          "User has been logged in successfully."
        )
      );
  } catch (error) {
    console.error("❌ Login error:", error.message);

    // Handle specific errors from findByCredentials
    if (error.message === "Invalid credentials") {
      throw new ApiError(
        401,
        "Invalid email or password. Please check your credentials."
      );
    }
    if (error.message.includes("locked")) {
      throw new ApiError(423, error.message);
    }
    throw new ApiError(500, "Login failed. Please try again.");
  }
});

// User Logout
const logoutUser = asyncHandler(async (request, response) => {
  await User.findByIdAndUpdate(
    request.user._id,
    { $set: { refreshToken: null } },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  console.log("✅ User logged out:", request.user.userName);

  return response
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User has been logged out successfully."));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (request, response) => {
  const incomingRefreshToken =
    request.cookies.refreshToken || request.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token has expired. Please login again.");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.refreshToken_SECRET
    );
    const tokenUser = await User.findById(decodedToken?._id);

    if (!tokenUser) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    if (incomingRefreshToken !== tokenUser?.refreshToken) {
      throw new ApiError(401, "Refresh token is invalid or expired!");
    }

    if (!tokenUser.isActive) {
      throw new ApiError(403, "Account has been deactivated. Contact support.");
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(tokenUser._id);

    return response
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    throw new ApiError(500, "Error occurred while refreshing access token.");
  }
});

// Change Password
const changePassword = asyncHandler(async (request, response) => {
  const { oldPassword, newPassword } = request.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters long");
  }

  const findUser = await User.findById(request.user?._id).select(
    "+userPassword"
  );

  if (!findUser) {
    throw new ApiError(404, "User not found.");
  }

  const isOldPasswordCorrect = await findUser.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect.");
  }

  findUser.userPassword = newPassword;
  const isSaved = await findUser.save({ validateBeforeSave: false });

  console.log("✅ Password changed for user:", findUser.userName);

  return response
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been changed successfully."));
});

// Get Current User
const getCurrentUser = asyncHandler(async (request, response) => {
  const userId = request?.params.userId || request?.user?._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  const getUser = await User.findById(userId).select(
    "-userPassword -refreshToken"
  );

  if (!getUser) {
    throw new ApiError(404, "User not found.");
  }

  // Check permissions
  const requestingUser = request.user;
  const isOwnProfile = userId === requestingUser._id.toString();
  const isTeacherOrAdmin = ["teacher", "admin"].includes(
    requestingUser.userRole
  );

  if (!isOwnProfile && !isTeacherOrAdmin) {
    throw new ApiError(403, "You don't have permission to view this profile.");
  }

  return response
    .status(200)
    .json(new ApiResponse(200, getUser, "User details fetched successfully."));
});

// Update Account Details
const updateAccountDetails = asyncHandler(async (request, response) => {
  const userId = request.user?._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  const {
    userName,
    userEmail,
    userPhoneNumber,
    userBio,
    userRole,
    countryCode,
    userLocation,
    userAcademicInformation,
    userSkills,
    userSocialMediaProfiles,
  } = request.body;

  const fieldsToUpdate = {};

  if (userName) fieldsToUpdate.userName = userName.trim();
  if (userEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      throw new ApiError(400, "Please provide a valid email address");
    }
    fieldsToUpdate.userEmail = userEmail.toLowerCase().trim();
  }
  if (userPhoneNumber) fieldsToUpdate.userPhoneNumber = userPhoneNumber.trim();
  if (userBio) fieldsToUpdate.userBio = userBio.trim();
  if (userLocation) fieldsToUpdate.userLocation = userLocation;
  if (userAcademicInformation)
    fieldsToUpdate.userAcademicInformation = userAcademicInformation;
  if (userSkills) fieldsToUpdate.userSkills = userSkills;
  if (userSocialMediaProfiles)
    fieldsToUpdate.userSocialMediaProfiles = userSocialMediaProfiles;

  // Handle role updates (only admins can change roles)
  if (userRole) {
    if (request.user.userRole !== "admin") {
      throw new ApiError(403, "Only administrators can change user roles.");
    }
    if (!validateUserRole(userRole)) {
      throw new ApiError(
        400,
        "Invalid user role. Must be student, teacher, or admin."
      );
    }
    fieldsToUpdate.userRole = userRole.toLowerCase();
  }

  // Handle file uploads
  if (request.files?.avatar?.[0]) {
    const avatarResult = await uploadOnCloudinary(request.files.avatar[0].path);
    fieldsToUpdate.userProfileImage = avatarResult?.url || "";
  }

  if (request.files?.coverImage?.[0]) {
    const coverImageResult = await uploadOnCloudinary(
      request.files.coverImage[0].path
    );
    fieldsToUpdate.userCoverImage = coverImageResult?.url || "";
  }

  // Check if email is being changed and if it's already taken
  if (fieldsToUpdate.userEmail) {
    const existingUser = await User.findOne({
      userEmail: fieldsToUpdate.userEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(409, "Email is already in use by another account.");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  ).select("-userPassword -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found.");
  }

  console.log("✅ Profile updated for user:", updatedUser.userName);

  return response
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User details updated successfully.")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  googleAuth,
  completeSocialProfile,
};

// ======================================================================================== //

// import asyncHandler from "express-async-handler";
// import User from "../models/user.models.js";
// import ApiResponse from "../utils/apiResponse.js";
// import ApiError from "../utils/apiError.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { verifyGoogleToken } from "../services/googleAuth.service.js";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";

// dotenv.config({ path: "src/.env" });

// // Valid user roles
// const VALID_ROLES = ["student", "teacher", "admin"];

// // ✅ FIXED: Add await to token generation
// const generateAccessTokenAndRefreshToken = asyncHandler(async (userId) => {
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       throw new ApiError(404, "User not found in the database.");
//     }

//     console.log(`Generating tokens using User document methods\n`);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     console.log(`✅ Tokens generated for user: ${user.userName}`);
//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.error("❌ Token generation error:", error);
//     throw new ApiError(
//       500,
//       "Error in generating access token and refresh token."
//     );
//   }
// });

// // Helper function to validate user role
// const validateUserRole = (role) => {
//   if (!role) {
//     return false;
//   }
//   return VALID_ROLES.includes(role.toLowerCase());
// };

// // ✅ FIXED: Google OAuth Login/Register
// const googleAuth = asyncHandler(async (request, response) => {
//   const { credential } = request.body;

//   if (!credential) {
//     throw new ApiError(400, "Google credential is required");
//   }

//   try {
//     // ✅ FIXED: Properly decode the base64 credential
//     let googleUser;
//     try {
//       // First try to verify as JWT token
//       googleUser = await verifyGoogleToken(credential);
//     } catch (error) {
//       // If JWT verification fails, try to decode as base64
//       try {
//         const decoded = JSON.parse(atob(credential));
//         googleUser = {
//           email: decoded.email,
//           name: decoded.name,
//           picture: decoded.picture,
//           email_verified: decoded.email_verified,
//           google_id: decoded.sub,
//         };
//       } catch (decodeError) {
//         console.error("❌ Failed to decode Google credential:", decodeError);
//         throw new ApiError(401, "Invalid Google credential format");
//       }
//     }

//     if (!googleUser) {
//       throw new ApiError(401, "Invalid Google credential");
//     }

//     const { email, name, picture, email_verified, google_id } = googleUser;

//     // Check if user already exists
//     let user = await User.findOne({
//       $or: [
//         { userEmail: email.toLowerCase() },
//         { "metadata.googleId": google_id },
//       ],
//     });

//     if (user) {
//       // User exists, log them in
//       if (!user.isActive) {
//         throw new ApiError(403, "Account deactivated. Contact support.");
//       }

//       // Update user info
//       user.userLastLogin = new Date();
//       if (!user.metadata.googleId && google_id) {
//         user.metadata.googleId = google_id;
//       }
//       if (!user.userProfileImage && picture) {
//         user.userProfileImage = picture;
//       }
//       if (email_verified && !user.isEmailVerified) {
//         user.isEmailVerified = true;
//       }

//       await user.save({ validateBeforeSave: false });

//       // ✅ FIXED: Add await here
//       const { accessToken, refreshToken } =
//         await generateAccessTokenAndRefreshToken(user._id);

//       const loggedInUser = await User.findById(user._id).select(
//         "-userPassword -refreshToken"
//       );

//       const cookieOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       };

//       return response
//         .status(200)
//         .cookie("accessToken", accessToken, cookieOptions)
//         .cookie("refreshToken", refreshToken, cookieOptions)
//         .json(
//           new ApiResponse(
//             200,
//             {
//               user: loggedInUser,
//               accessToken,
//               refreshToken,
//               needsProfileCompletion: false,
//             },
//             "Google login successful."
//           )
//         );
//     } else {
//       // Create new user
//       const newUser = await User.create({
//         userName: name,
//         userEmail: email.toLowerCase(),
//         userProfileImage: picture || "",
//         isEmailVerified: email_verified || false,
//         metadata: {
//           googleId: google_id,
//           authProvider: "google",
//           accountSource: "google",
//         },
//         isActive: true,
//         userRole: "student",
//         userPhoneNumber: "",
//         countryCode: "",
//         userLocation: {
//           homeAddress: "",
//           currentAddress: "",
//         },
//       });

//       // ✅ FIXED: Add await here
//       const { accessToken, refreshToken } =
//         await generateAccessTokenAndRefreshToken(newUser._id);

//       const createdUser = await User.findById(newUser._id).select(
//         "-userPassword -refreshToken"
//       );

//       const cookieOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       };

//       return response
//         .status(201)
//         .cookie("accessToken", accessToken, cookieOptions)
//         .cookie("refreshToken", refreshToken, cookieOptions)
//         .json(
//           new ApiResponse(
//             201,
//             {
//               user: createdUser,
//               accessToken,
//               refreshToken,
//               needsProfileCompletion: true,
//             },
//             "Google registration successful. Please complete your profile."
//           )
//         );
//     }
//   } catch (error) {
//     console.error("❌ Google auth error:", error);
//     throw new ApiError(500, "Google authentication failed");
//   }
// });

// // ✅ FIXED: User Login
// const loginUser = asyncHandler(async (request, response) => {
//   const { userEmail = "", userPassword = "" } = request.body;

//   console.log("🔍 Login attempt for:", userEmail);

//   // Validation
//   if (userEmail?.trim() === "" || userPassword?.trim() === "") {
//     throw new ApiError(400, "Email and password are required.");
//   }

//   try {
//     // Use findByCredentials which handles password validation and account locking
//     const user = await User.findByCredentials(
//       userEmail.toLowerCase().trim(),
//       userPassword
//     );

//     // ✅ FIXED: Add await here
//     const { accessToken, refreshToken } =
//       await generateAccessTokenAndRefreshToken(user._id);

//     // Update last login
//     user.userLastLogin = new Date();
//     await user.save({ validateBeforeSave: false });

//     // Get user data without sensitive fields
//     const loggedInUser = await User.findById(user._id).select(
//       "-userPassword -refreshToken"
//     );

//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     };

//     // ✅ FIXED: Add needsProfileCompletion check
//     const needsCompletion =
//       !loggedInUser.userPhoneNumber ||
//       !loggedInUser.userLocation?.homeAddress ||
//       !loggedInUser.userLocation?.currentAddress;

//     console.log("✅ User logged in successfully:", loggedInUser.userName);

//     return response
//       .status(200)
//       .cookie("accessToken", accessToken, cookieOptions)
//       .cookie("refreshToken", refreshToken, cookieOptions)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             user: loggedInUser,
//             accessToken,
//             refreshToken,
//             needsProfileCompletion: needsCompletion,
//           },
//           "User has been logged in successfully."
//         )
//       );
//   } catch (error) {
//     console.error("❌ Login error:", error.message);

//     // Handle specific errors from findByCredentials
//     if (error.message === "Invalid credentials") {
//       throw new ApiError(
//         401,
//         "Invalid email or password. Please check your credentials."
//       );
//     }
//     if (error.message.includes("locked")) {
//       throw new ApiError(423, error.message);
//     }
//     throw new ApiError(500, "Login failed. Please try again.");
//   }
// });

// // ✅ FIXED: User Registration
// const registerUser = asyncHandler(async (request, response) => {
//   let {
//     userName = "",
//     userEmail = "",
//     userPhoneNumber = "",
//     countryCode = "",
//     userPassword = "",
//     userRole = "student",
//     userBio = "",
//     userLocation = {
//       homeAddress: "",
//       currentAddress: "",
//     },
//     userAcademicInformation = {},
//     userSkills = [],
//     userSocialMediaProfiles = [],
//   } = request.body;

//   // Handle userLocation if it comes as a string (from form data)
//   if (typeof userLocation === "string") {
//     try {
//       userLocation = JSON.parse(userLocation);
//     } catch (parseError) {
//       const homeAddressMatch = userLocation.match(
//         /"homeAddress"\s*:\s*"([^"]+)"/
//       );
//       const currentAddressMatch = userLocation.match(
//         /"currentAddress"\s*:\s*"([^"]+)"/
//       );

//       userLocation = {
//         homeAddress: homeAddressMatch ? homeAddressMatch[1] : "",
//         currentAddress: currentAddressMatch ? currentAddressMatch[1] : "",
//       };
//     }
//   }

//   // Parse other JSON fields
//   try {
//     if (typeof userAcademicInformation === "string") {
//       userAcademicInformation = JSON.parse(userAcademicInformation);
//     }
//     if (typeof userSkills === "string") {
//       userSkills = JSON.parse(userSkills);
//     }
//     if (typeof userSocialMediaProfiles === "string") {
//       userSocialMediaProfiles = JSON.parse(userSocialMediaProfiles);
//     }
//   } catch (parseError) {
//     console.warn("⚠️  JSON parsing failed for some fields, using defaults");
//   }

//   // Validate and normalize user role
//   if (!validateUserRole(userRole)) {
//     throw new ApiError(
//       400,
//       "Invalid user role. Must be student, teacher, or admin."
//     );
//   }
//   userRole = userRole.toLowerCase();

//   // Enhanced Validation
//   const validationErrors = [];

//   if (!userName?.trim()) validationErrors.push("Full name is required");
//   if (!userEmail?.trim()) {
//     validationErrors.push("Email is required");
//   } else {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(userEmail.trim())) {
//       validationErrors.push("Please provide a valid email address");
//     }
//   }
//   if (!userPhoneNumber?.trim())
//     validationErrors.push("Phone number is required");
//   if (!countryCode?.trim()) validationErrors.push("Country code is required");
//   if (!userPassword?.trim()) {
//     validationErrors.push("Password is required");
//   } else if (userPassword.length < 8) {
//     validationErrors.push("Password must be at least 8 characters long");
//   }
//   if (!userLocation?.homeAddress?.trim())
//     validationErrors.push("Home address is required");
//   if (!userLocation?.currentAddress?.trim())
//     validationErrors.push("Current address is required");

//   if (validationErrors.length > 0) {
//     throw new ApiError(
//       400,
//       `Validation failed: ${validationErrors.join(", ")}`
//     );
//   }

//   // Check if user already exists
//   const existingUser = await User.findOne({
//     $or: [
//       { userEmail: userEmail.toLowerCase() },
//       { userName: userName.trim() },
//     ],
//   });

//   if (existingUser) {
//     throw new ApiError(
//       409,
//       "User with this email or username already exists. Please try to Login"
//     );
//   }

//   // Handle file uploads
//   let userProfileImagePath = "";
//   let userCoverImagePath = "";

//   if (request.files?.avatar?.[0]) {
//     const avatarResult = await uploadOnCloudinary(request.files.avatar[0].path);
//     userProfileImagePath = avatarResult?.url || "";
//   }

//   if (request.files?.coverImage?.[0]) {
//     const coverImageResult = await uploadOnCloudinary(
//       request.files.coverImage[0].path
//     );
//     userCoverImagePath = coverImageResult?.url || "";
//   }

//   // Create user
//   const newUser = await User.create({
//     userName: userName.trim(),
//     userEmail: userEmail.trim().toLowerCase(),
//     userPassword,
//     userPhoneNumber: userPhoneNumber.trim(),
//     countryCode: countryCode.trim(),
//     userRole: userRole,
//     userLocation: userLocation,
//     userBio: userBio?.trim() || "",
//     userProfileImage: userProfileImagePath,
//     userCoverImage: userCoverImagePath,
//     userAcademicInformation: userAcademicInformation || {},
//     userSkills: Array.isArray(userSkills) ? userSkills : [],
//     userSocialMediaProfiles: Array.isArray(userSocialMediaProfiles)
//       ? userSocialMediaProfiles
//       : [],
//   });

//   // ✅ FIXED: Add await here
//   const { accessToken, refreshToken } =
//     await generateAccessTokenAndRefreshToken(newUser._id);

//   // Get user without sensitive fields
//   const createdUser = await User.findById(newUser._id).select(
//     "-userPassword -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiError(
//       500,
//       "User registration failed - could not retrieve created user."
//     );
//   }

//   const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   };

//   console.log("✅ User registered successfully:", createdUser.userName);

//   return response
//     .status(201)
//     .cookie("accessToken", accessToken, cookieOptions)
//     .cookie("refreshToken", refreshToken, {
//       ...cookieOptions,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     })
//     .json(
//       new ApiResponse(
//         201,
//         {
//           user: createdUser,
//           accessToken,
//           refreshToken,
//           needsProfileCompletion: false,
//         },
//         "User has been registered successfully."
//       )
//     );
// });

// export {
//   registerUser,
//   loginUser,
//   // logoutUser,
//   // refreshAccessToken,
//   // changePassword,
//   // getCurrentUser,
//   // updateAccountDetails,
//   googleAuth,
//   // completeSocialProfile,
// };
