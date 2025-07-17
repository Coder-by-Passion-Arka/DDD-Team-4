import asyncHandler from "express-async-handler";
import User from "../models/user.models.js";

export const findStudent = asyncHandler(async (request, response) => {
  const { attributeName, attributeValue } = request.params;
  // Attribute name can be Email or Phone-Number
    
  // Find the student from the database
  const student = await User.findOne({
    // Getting the user who matches the attribute name and value passed in the request
    [attributeName]: attributeValue,
  });

  if (!student) {
    return response.status(404).json({
      success: false,
      message: "Student not found, please enter valid ",
    });
  }

  response.status(200).json(student);
});

// Find the teacher from the database
export const findTeacher = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  // Find the teacher from the database
  const teacher = await findUserById(userId);

  if (!teacher) {
    return response.status(404).json({
      success: false,
      message: "Teacher not found",
    });
  }

  response.status(200).json(teacher);
});

export default { findStudent, findTeacher };