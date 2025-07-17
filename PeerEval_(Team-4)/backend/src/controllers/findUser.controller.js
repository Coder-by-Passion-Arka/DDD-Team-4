// import asyncHandler from "express-async-handler";
// import User from "../models/user.models.js";

// export const findStudent = asyncHandler(async (request, response) => {
//   const { attributeName, attributeValue } = request.query;
//   // Attribute name can be Email or Phone-Number
//   if (attributeName === "Email" || attributeName === "email") {
//     attributeName = "userEmail";
//   } else if (
//     attributeName === "Phone-Number" ||
//     attributeName === "phone-number"
//   ) {
//     attributeName = "userPhoneNumber";
//   } else {
//     console.log("Invalid attribute name");
//   }

//   console.log(
//     `attributeName: ${attributeName}& attributeValue: ${attributeValue}`
//   );

//   // Find the student from the database
//   const student = await User.findOne({
//     // Getting the user who matches the attribute name and value passed in the request
//     [attributeName]: attributeValue,
//   });

//   if (!student) {
//     return response.status(404).json({
//       success: false,
//       message: "Student not found, please enter valid ",
//     });
//   }

//   response.status(200).json(student);
// });

// // Find the teacher from the database
// export const findTeacher = asyncHandler(async (request, response) => {
//   const { userId } = request.params;

//   // Find the teacher from the database
//   const teacher = await findUserById(userId);

//   if (!teacher) {
//     return response.status(404).json({
//       success: false,
//       message: "Teacher not found",
//     });
//   }

//   response.status(200).json(teacher);
// });

// export default { findStudent, findTeacher };

// ================================================= //

import asyncHandler from "express-async-handler";
import User from "../models/user.models.js";

// Helper function to find user by ID
const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
};

export const findStudent = asyncHandler(async (request, response) => {
  const { attributeName, attributeValue } = request.query;

  // Validate input parameters
  if (!attributeName || !attributeValue) {
    return response.status(400).json({
      success: false,
      message: "Both attributeName and attributeValue are required",
    });
  }

  // Map attribute names to database field names
  let dbFieldName;
  const lowerAttributeName = attributeName.toLowerCase();

  if (lowerAttributeName === "email") {
    dbFieldName = "userEmail";
  } else if (
    lowerAttributeName === "phone-number" ||
    lowerAttributeName === "phone_number"
  ) {
    dbFieldName = "userPhoneNumber";
  } else {
    return response.status(400).json({
      success: false,
      message: "Invalid attribute name. Use 'Email' or 'Phone-Number'",
    });
  }

  console.log(`Searching for user with ${dbFieldName}: ${attributeValue}`);

  try {
    // Find the student from the database
    const student = await User.findOne({
      [dbFieldName]: attributeValue,
      userRole: "student", // Ensure we're only finding students
    });

    if (!student) {
      return response.status(404).json({
        success: false,
        message: `Student not found with ${attributeName}: ${attributeValue}`,
      });
    }

    // Return student data (you might want to exclude sensitive fields)
    const { userPassword, refreshToken, ...studentData } = student.toObject();

    response.status(200).json({
      success: true,
      data: studentData,
      message: "Student found successfully",
    });
  } catch (error) {
    console.error("Error finding student:", error);
    response.status(500).json({
      success: false,
      message: "Internal server error while searching for student",
    });
  }
});

// Find the teacher from the database
export const findTeacher = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  // Validate input
  if (!userId) {
    return response.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    // Find the teacher from the database
    const teacher = await findUserById(userId);

    if (!teacher) {
      return response.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Verify the user is actually a teacher
    if (teacher.userRole !== "teacher") {
      return response.status(400).json({
        success: false,
        message: "User is not a teacher",
      });
    }

    // Return teacher data (exclude sensitive fields)
    const { userPassword, refreshToken, ...teacherData } = teacher.toObject();

    response.status(200).json({
      success: true,
      data: teacherData,
      message: "Teacher found successfully",
    });
  } catch (error) {
    console.error("Error finding teacher:", error);
    response.status(500).json({
      success: false,
      message: "Internal server error while searching for teacher",
    });
  }
});

export default { findStudent, findTeacher };