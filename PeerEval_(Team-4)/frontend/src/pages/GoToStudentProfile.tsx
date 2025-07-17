// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { Shield, User, Search } from "lucide-react";

// function GoToStudentProfileDialog() {
//   const { state } = useAuth();
//   const [studentId, setStudentId] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [attributeName, setAttributeName] = useState("Email");

//   // Check if user is logged in
//   if (!state.user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
//           <div className="text-center">
//             <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               Authentication Required
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Please log in to access student profiles
//             </p>
//             <button
//               onClick={() => navigate("/login")}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//             >
//               Go to Login
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // const handleFindProfile = async (
//   //   event: React.KeyboardEvent<HTMLInputElement>,
//   //   studentId: string
//   // ) => {
//   //   // Check if the pressed key is "Enter"
//   //   if (event.key === "Enter") {
//   //     // Go to the profile page with the entered ID
//   //     if (!studentId.trim()) {
//   //       setError("Please enter a student ID or email");
//   //       return;
//   //     }

//   //     setIsLoading(true);

//   //     try {
//   //       // Navigate to the profile page with the entered ID
//   //       // The request must send the attributeName and attributeValue as query parameters
//   //       navigate(
//   //         `/find-student?attributeName=${attributeName}&attributeValue=${studentId}`
//   //       );
//   //     } catch (error) {
//   //       console.error("Error navigating to student profile:", error);
//   //       setError("Failed to navigate to student profile");
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   }
//   // };

//   // Check if user has permission to view student profiles
//   if (state.user?.userRole === "student") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
//           <div className="text-center">
//             <Shield className="w-16 h-16 mx-auto text-red-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               Access Denied
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Students cannot access other student profiles. This feature is
//               only available to teachers and administrators.
//             </p>
//             <div className="space-y-3">
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//               >
//                 Go to Dashboard
//               </button>
//               <button
//                 onClick={() => navigate("/profile")}
//                 className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//               >
//                 View My Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!studentId.trim()) {
//       setError("Please enter a student ID or email");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // In a real implementation, you would first validate that the student exists
//       // and that the current user has permission to view their profile

//       // For now, we'll just navigate to the profile page
//       // The profile page should handle the actual user lookup and permission checks

//       // Navigate to the profile page with the entered ID
//       navigate(
//         `/api/v1/find-user/find-student?attributeName=${attributeName}&attributeValue=${studentId.trim()}`
//       );
//     } catch (error) {
//       console.error("Error navigating to student profile:", error);
//       setError("Failed to navigate to student profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getRoleDisplayName = (role: string) => {
//     switch (role) {
//       case "teacher":
//         return "Teacher";
//       case "admin":
//         return "Administrator";
//       default:
//         return "User";
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
//         <div className="text-center mb-6">
//           <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
//             <Search className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Find Student Profile
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Enter a Email or Phone Number to view their profile
//           </p>
//         </div>

//         {/* User role indicator */}
//         <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//           <div className="flex items-center space-x-2">
//             <User className="w-4 h-4 text-gray-500" />
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               Logged in as:{" "}
//               <span className="font-medium text-gray-900 dark:text-white">
//                 {getRoleDisplayName(state.user?.userRole || "")}
//               </span>
//             </span>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//             <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Attribute Name */}
//           <div>
//             {/* <label
//               htmlFor="attributeName"
//               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
//             >
//               Please Slect either Email or Phone Number
//             </label> */}
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-gray-900 dark:text-gray-300">Search by Email</span>
//               <input
//                 type="radio"
//                 name="attributeName"
//                 value="Email"
//                 checked={attributeName === "Email"}
//                 onChange={(e) => setAttributeName(e.target.value)}
//                 className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-900 dark:text-gray-300">Search by Phone Number</span>
//               <input
//                 type="radio"
//                 name="attributeName"
//                 value="Phone-Number"
//                 checked={attributeName === "Phone-Number"}
//                 onChange={(e) => setAttributeName(e.target.value)}
//                 className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//               />
//             </div>
//           </div>
//           {/* Attribute Value */}
//           <div>
//             <label
//               htmlFor="studentId"
//               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
//             >
//               Student Email or Phone Number
//             </label>
//             <input
//               id="studentId"
//               type="text"
//               value={studentId}
//               onChange={(e) => setStudentId(e.target.value)}
//               placeholder="Enter student's email, or phone number"
//               disabled={isLoading}
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//             {/* <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//               You can search by User's email address, or phone number
//             </p> */}
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || !studentId.trim()}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//             // onClick = {handleFindProfile}
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 <span>Searching...</span>
//               </>
//             ) : (
//               <>
//                 <Search className="w-4 h-4" />
//                 <span>View Profile</span>
//               </>
//             )}
//           </button>
//         </form>

//         {/* Additional actions */}
//         {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
//           <div className="flex space-x-3">
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//             >
//               Dashboard
//             </button>
//             <button
//               onClick={() => navigate("/profile")}
//               className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//             >
//               My Profile
//             </button>
//           </div>
//         </div> */}

//         {/* Permissions note */}
//         <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//           <p className="text-xs text-blue-800 dark:text-blue-200">
//             <strong>Note:</strong> You can view student profiles based on your
//             role permissions. Contact your administrator if you need access to
//             specific profiles.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GoToStudentProfileDialog;

// ======================================================== //

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, User, Search } from "lucide-react";
import { apiService } from "../services/api";

interface AcademicInformation {
  institution: string;
  degree: string;
  graduationYear: string;
  gpa: string;
  // Add other academic fields as needed
}

interface Student {
  _id: string;
  userEmail: string;
  userPhoneNumber: string;
  userName: string;
  userRole: string;
  AcademicInformation?: AcademicInformation;
  userSkills?: Array<{
    name: string;
    category?: string;
    level?: string;
  }>;
  // Add other fields as needed
}

interface ApiResponse {
  success: boolean;
  data?: Student;
  message: string;
}

function GoToStudentProfileDialog() {
  const { state } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const navigate = useNavigate();
  const [attributeName, setAttributeName] = useState("Email");

  // Check if user is logged in
  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please log in to access student profiles
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has permission to view student profiles
  if (state.user?.userRole === "student") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Students cannot access other student profiles. This feature is
              only available to teachers and administrators.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setStudentData(null);

  //   if (!studentId.trim()) {
  //     setError("Please enter a student ID or email");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     // Get the JWT token from your auth context or local storage
  //     // const token = state.token || localStorage.getItem("token");

  //     // if (!token) {
  //     //   setError("Authentication token not found. Please log in again.");
  //     //   setIsLoading(false);
  //     //   return;
  //     // }

  //     // Make API call to find the student
  //     const response = await apiService.get(
  //       `/api/v1/find-user/find-student?attributeName=${attributeName}&attributeValue=${encodeURIComponent(
  //         studentId.trim()
  //       )}`,
  //       // {
  //       //   method: "GET",
  //       //   headers: {
  //       //     "Content-Type": "application/json",
  //       //     Authorization: `Bearer ${token}`,
  //       //   },
  //       // }
  //     );

  //     const data: ApiResponse = response.json();

  //     if (data.success && data.data) {
  //       setStudentData(data.data);
  //       setError("");

  //       // Optional: Navigate to a dedicated student profile page
  //       // navigate(`/student-profile/${data.data._id}`, { state: { student: data.data } });
  //     } else {
  //       setError(data.message || "Student not found");
  //     }
  //   } catch (error) {
  //     console.error("Error finding student:", error);
  //     setError("Failed to find student. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStudentData(null);

    if (!studentId.trim()) {
      setError("Please enter a student ID or email");
      return;
    }

    setIsLoading(true);

    try {
      // Use the normalized endpoint (no /api/v1/ prefix)
      const data = await apiService.get<Student>(
        `find-user/find-student?attributeName=${attributeName}&attributeValue=${encodeURIComponent(
          studentId.trim()
        )}`
      );

      if (data && typeof data === "object" && data._id) {
        setStudentData(data);
        setError("");
        // Optionally navigate to profile page:
        // navigate(`/student-profile/${data._id}`, { state: { student: data } });
      } else {
        setError("Student not found");
      }
    } catch (error: any) {
      // Try to extract error message from Axios error
      let msg = "Failed to find student. Please try again.";
      if (error?.response?.data?.message) {
        msg = error.response.data.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "teacher":
        return "Teacher";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  const handleViewFullProfile = async () => {
    if (!studentData?._id) return;

    setIsLoading(true);
    setError("");

    if (studentData) {
      try {
        // Fetch the latest student data from the backend using the student's _id
        // (Assuming you have an endpoint like /find-user/find-student-by-id/:id)
        const latestData = await apiService.get<Student>(
          `find-user/find-student-by-id/${studentData._id}`
        );

        if (latestData && typeof latestData === "object" && latestData._id) {
          setStudentData(latestData);
          // Optionally, you can show a modal or navigate to a profile page here
          // For now, just display the modal as before
        } else {
          setError("Could not retrieve full profile details.");
        }
      } catch (error: any) {
        let msg = "Failed to retrieve full profile. Please try again.";
        if (error?.response?.data?.message) {
          msg = error.response.data.message;
          console.error(`Error retrieving full profile: ${msg} in GoToStudentProfile`);
        }
        setError(msg);
      }
      finally {
        setIsLoading(false);
      }

      // Display the Stats of the student
      return (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
                onClick={() => setStudentData(null)}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Student Profile
              </h2>
              <div className="mb-4">
                <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                  {studentData.userName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: {studentData.userEmail}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone: {studentData.userPhoneNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Role: {studentData.userRole}
                </p>
              </div>
              {/* Academic Information */}
              {studentData.AcademicInformation && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Academic Information
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>
                      <span className="font-medium">Institution:</span>{" "}
                      {studentData.AcademicInformation.institution}
                    </li>
                    <li>
                      <span className="font-medium">Degree:</span>{" "}
                      {studentData.AcademicInformation.degree}
                    </li>
                    <li>
                      <span className="font-medium">Graduation Year:</span>{" "}
                      {studentData.AcademicInformation.graduationYear}
                    </li>
                    <li>
                      <span className="font-medium">GPA:</span>{" "}
                      {studentData.AcademicInformation.gpa}
                    </li>
                  </ul>
                </div>
              )}
              {/* Skills */}
              {Array.isArray(studentData.userSkills) &&
                studentData.userSkills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Skills
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {studentData.userSkills.map((skill: any, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <span>
                            <span className="font-medium">{skill.name}</span>
                            {skill.category && (
                              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5">
                                {skill.category}
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-indigo-600 dark:text-indigo-400">
                            {skill.level}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              <div className="flex justify-end">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  onClick={() => setStudentData(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Find Student Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter an Email or Phone Number to view their profile
          </p>
        </div>

        {/* User role indicator */}
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {getRoleDisplayName(state.user?.userRole || "")}
              </span>
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Student found success message */}
        {studentData && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="text-green-800 dark:text-green-200 font-medium mb-2">
              Student Found!
            </h3>
            <div className="text-sm text-green-700 dark:text-green-300">
              <p>
                <strong>Name:</strong> {studentData.userName}
              </p>
              <p>
                <strong>Email:</strong> {studentData.userEmail}
              </p>
              <p>
                <strong>Phone:</strong> {studentData.userPhoneNumber}
              </p>
              <p>
                <strong>Role:</strong> {studentData.userRole}
              </p>
            </div>
            <button
              onClick={handleViewFullProfile}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View Full Profile"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Attribute Name Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Search Method
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="email"
                  name="attributeName"
                  value="Email"
                  checked={attributeName === "Email"}
                  onChange={(e) => setAttributeName(e.target.value)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="email"
                  className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                >
                  Search by Email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="phone"
                  name="attributeName"
                  value="Phone-Number"
                  checked={attributeName === "Phone-Number"}
                  onChange={(e) => setAttributeName(e.target.value)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="phone"
                  className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                >
                  Search by Phone Number
                </label>
              </div>
            </div>
          </div>

          {/* Attribute Value Input */}
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Student {attributeName === "Email" ? "Email" : "Phone Number"}
            </label>
            <input
              id="studentId"
              type={attributeName === "Email" ? "email" : "tel"}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder={
                attributeName === "Email"
                  ? "Enter student's email address"
                  : "Enter student's phone number"
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !studentId.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Student</span>
              </>
            )}
          </button>
        </form>

        {/* Navigation buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              My Profile
            </button>
          </div>
        </div>

        {/* Permissions note */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> You can view student profiles based on your
            role permissions. Contact your administrator if you need access to
            specific profiles.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoToStudentProfileDialog;
