import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Students: React.FC = () => {
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);

  // Dummy data for courses
  const dummyCourses = [
    { id: 101, name: "Introduction to React" },
    { id: 102, name: "Advanced JavaScript" },
    { id: 103, name: "Node.js Fundamentals" },
  ];

  // Dummy data for students
  const dummyStudents = {
    101: [
      {
        id: 1,
        name: "Arkapravo Das",
        email: "arkapravodas@gmail.com",
        status: "Active",
      },
      {
        id: 2,
        name: "Student_0",
        email: "student_0@gmail.com",
        status: "Active",
      },
    ],
    102: [
      {
        id: 3,
        name: "Student_1",
        email: "student_1@gmail.com",
        status: "Active",
      },
      {
        id: 4,
        name: "Student_2",
        email: "student_2@gmail.com",
        status: "Active",
      },
    ],
    103: [
      {
        id: 5,
        name: "Student_3",
        email: "student_3@gmail.com",
        status: "Active",
      },
    ],
  };

  // Use useCallback to memoize the student fetching function
  const fetchStudents = useCallback((courseId: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents(dummyStudents[courseId] || []);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    setCourses(dummyCourses);
  }, []);

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
    fetchStudents(courseId);
  };

  const renderCourseCards = () => (
    <div className="flex flex-wrap justify-center gap-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 w-64 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleCourseClick(course.id)}
        >
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
            {course.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Click to view enrolled students.
          </p>
        </div>
      ))}
    </div>
  );

  const renderStudentTable = () => (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-900">
      <table className="min-w-full divide-y divide-indigo-200 dark:divide-gray-700">
        <thead className="bg-indigo-100 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-indigo-100 dark:divide-gray-800">
          {students.map((student) => (
            <tr
              key={student.id}
              className="hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
            >
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
                {student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                {student.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                    student.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUnAuthorisedAccess = () => <Navigate to="/not-authorised" />;

  const renderStudentsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-white mb-2 drop-shadow-lg">
            Student Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage students enrolled in your courses.
          </p>
        </div>
        {courses.length > 0 && !selectedCourse ? (
          renderCourseCards()
        ) : (
          <>
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={() => setSelectedCourse(null)}
            >
              Back to Courses
            </button>
            {isLoading ? (
              <p className="text-center text-lg text-gray-600 dark:text-gray-300">
                Loading students...
              </p>
            ) : (
              renderStudentTable()
            )}
          </>
        )}
      </div>
    </div>
  );

  switch (state?.user?.userRole) {
    case "student":
      return renderUnAuthorisedAccess();
    case "teacher":
    case "admin":
      return renderStudentsPage();
    default:
      return renderUnAuthorisedAccess();
  }
};

export default Students;
