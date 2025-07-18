// Enhanced App.tsx - Key fixes marked with 
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Component Imports
import ProtectedRoute from "./components/ProtectedRoute";
import Breadcrumb from "./components/Breadcrumb";
import SocialProfileCompletion from "./components/SocialProfileCompletion";
import Preferences from "./components/Preferences";

// Cookie Preferences Import
import { CookiePreferencesManager } from "./utils/cookiePreferences";


// Pages Imports
import DashboardHome from "./pages/Dashboard";
import AssignmentPage from "./pages/Assignments";
import EvaluationsPage from "./pages/Evaluations";
import AnalyticsPage from "./pages/Analytics";
import AchievementsPage from "./pages/Achievements";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoToStudentProfile from "./pages/GoToStudentProfile";
import GoToTeacherProfile from "./pages/GoToTeacherProfile";
import Courses from "./pages/Courses";
import StudentsPage from "./pages/Students";
import NotFound from "./pages/NotFound";
import NotAuthorised from "./pages/UnauthorisedAccess";

// Admin Components
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminSystemSettings from "./pages/AdminSystemSettings";

// Context Imports
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { StreakProvider } from "./contexts/StreakContext";
import ToastContainer from "./components/ToastContainer";
import { useAuth } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Complete Profile Page component
const CompleteProfilePage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-2xl w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complete Your Profile
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Please provide additional information to complete your account setup
        </p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-200">
          Profile completion form will be implemented here based on your
          requirements.
        </p>
      </div>
    </div>
  </div>
);

function App() {
  // Initialize cookie preferences on app startup
  useEffect(() => {
    CookiePreferencesManager.initializePreferences();
  }, []);

  // Get Google Client ID from environment
  const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "10314053648-9i01d2gvt3qpspm6elmapdpakishbco9.apps.googleusercontent.com";

  if (!GOOGLE_CLIENT_ID) {
    console.warn("⚠️ VITE_GOOGLE_CLIENT_ID not found in environment variables");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AnalyticsProvider>
              <StreakProvider>
                <AppContent />
              </StreakProvider>
            </AnalyticsProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

// Wrapper component to handle social profile completion
const AppContent: React.FC = () => {
  const { state, completeSocialProfile } = useAuth();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  //  ENHANCED: Better profile completion detection
  useEffect(() => {
    console.log("🔍 Checking if profile completion modal should be shown:", {
      isAuthenticated: state.isAuthenticated,
      needsProfileCompletion: state.needsProfileCompletion,
      user: state.user?.userName,
    });

    if (state.isAuthenticated && state.needsProfileCompletion && state.user) {
      console.log("📋 Showing profile completion modal");
      setShowProfileCompletion(true);
    } else {
      setShowProfileCompletion(false);
    }
  }, [state.isAuthenticated, state.needsProfileCompletion, state.user]);

  useEffect(() => {
    // Apply theme from cookie on app load
    const savedTheme = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme="))
      ?.split("=")[1];

    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  //  ENHANCED: Better profile completion handling
  const handleProfileComplete = async (data: any) => {
    try {
      console.log("🔍 Completing social profile with data:", data);
      await completeSocialProfile(data);
      setShowProfileCompletion(false);
      console.log("✅ Profile completion successful");
    } catch (error) {
      console.error("❌ Profile completion failed:", error);
      // Don't close the modal on error, let user try again
    }
  };

  const handleProfileCancel = () => {
    // Log the user out if they cancel profile completion
    console.log("🚫 User cancelled profile completion, logging out");
    setShowProfileCompletion(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {/* Toast container - render outside Routes */}
          <ToastContainer />

          {/* ✅ ENHANCED: Social profile completion modal with better conditional rendering */}
          {showProfileCompletion && state.user && (
            <SocialProfileCompletion
              onComplete={handleProfileComplete}
              onCancel={handleProfileCancel}
            />
          )}

          {/* Global Preferences Component */}
          <Preferences />

          <Routes>
            {/* Public routes */}
            <Route path="*" element={<NotFound />} /> {/* Fallback for undefined routes */}
            <Route path="/not-authorised" element={<NotAuthorised />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Complete profile route */}
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute>
                  <CompleteProfilePage />
                </ProtectedRoute>
              }
            />


            {/* Public routes for teacher dashboard buttons */}
            <Route path="assignments/create" element={<AssignmentPage />} />
            <Route path="evaluations/pending" element={<EvaluationsPage />} />

            {/* Protected routes with layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Breadcrumb />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />

              <Route path="courses" element={<Courses />} />
              <Route path="find-student" element={<GoToStudentProfile />} />
              <Route path="find-teacher" element={<GoToTeacherProfile />} />
              <Route path="assignments" element={<AssignmentPage />} />
              <Route path="evaluations" element={<EvaluationsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/:userId" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              {/* Students page now inside layout for sidebar visibility */}
              <Route path="students" element={<StudentsPage />} />

              {/* Admin-only routes */}
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/system"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSystemSettings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback for undefined routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;

// ======================================================================= //

// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Component Imports
// import ProtectedRoute from "./components/ProtectedRoute";
// import Breadcrumb from "./components/Breadcrumb";
// import SocialProfileCompletion from "./components/SocialProfileCompletion";
// import Preferences from "./components/Preferences";

// // Pages Imports
// import DashboardHome from "./pages/Dashboard";
// import AssignmentPage from "./pages/Assignments";
// import EvaluationsPage from "./pages/Evaluations";
// import AnalyticsPage from "./pages/Analytics";
// import AchievementsPage from "./pages/Achievements";
// import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import GoToStudentProfile from "./pages/GoToStudentProfile";
// import Courses from "./pages/Courses";

// // Context Imports
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ToastProvider } from "./contexts/ToastContext";
// import ToastContainer from "./components/ToastContainer";
// import { useAuth } from "./contexts/AuthContext";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// // Admin Components
// const AdminUserManagement: React.FC = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//       User Management
//     </h1>
//     <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
//       <p className="text-gray-600 dark:text-gray-400">
//         Admin user management interface - coming soon...
//       </p>
//     </div>
//   </div>
// );

// const AdminSystemSettings: React.FC = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//       System Settings
//     </h1>
//     <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
//       <p className="text-gray-600 dark:text-gray-400">
//         System settings interface - coming soon...
//       </p>
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <ThemeProvider>
//       <ToastProvider>
//           <AuthProvider>
//             <AppContent />
//           </AuthProvider>
//         </ToastProvider>
//     </ThemeProvider>
//   );
// }

// // Wrapper component to handle social profile completion
// const AppContent: React.FC = () => {
//   const { state, completeSocialProfile } = useAuth();
//   const [showProfileCompletion, setShowProfileCompletion] = useState(false);

//   useEffect(() => {
//     if (state.isAuthenticated && state.needsProfileCompletion) {
//       setShowProfileCompletion(true);
//     }
//   }, [state.isAuthenticated, state.needsProfileCompletion]);

//   useEffect(() => {
//     // Apply theme from cookie on app load
//     const savedTheme = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("theme="))
//       ?.split("=")[1];

//     if (savedTheme) {
//       document.documentElement.setAttribute("data-theme", savedTheme);
//     }
//   }, []);

//   const handleProfileComplete = async (data: any) => {
//     try {
//       await completeSocialProfile(data);
//       setShowProfileCompletion(false);
//     } catch (error) {
//       console.error("Profile completion failed:", error);
//     }
//   };

//   const handleProfileCancel = () => {
//     // Log the user out if they cancel profile completion
//     setShowProfileCompletion(false);
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       <Router>
//         <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
//           {/* Toast container - render outside Routes */}
//           <ToastContainer />

//           {/* Social profile completion modal */}
//           {showProfileCompletion && (
//             <SocialProfileCompletion
//               onComplete={handleProfileComplete}
//               onCancel={handleProfileCancel}
//             />
//           )}

//           {/* Global Preferences Component */}
//           <Preferences />

//           <Routes>
//             {/* Public routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Protected routes with layout */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Breadcrumb />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<Navigate to="/dashboard" replace />} />
//               <Route path="dashboard" element={<DashboardHome />} />
//               <Route path="courses" element={<Courses />} />
//               <Route path="find-student" element={<GoToStudentProfile />} />
//               <Route path="assignments" element={<AssignmentPage />} />
//               <Route path="evaluations" element={<EvaluationsPage />} />
//               <Route path="analytics" element={<AnalyticsPage />} />
//               <Route path="achievements" element={<AchievementsPage />} />
//               <Route path="profile" element={<ProfilePage />} />
//               <Route path="profile/:userId" element={<ProfilePage />} />
//               <Route path="settings" element={<SettingsPage />} />

//               {/* Admin-only routes */}
//               <Route
//                 path="admin/users"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminUserManagement />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="admin/system"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminSystemSettings />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Fallback for undefined routes */}
//               <Route path="*" element={<Navigate to="/dashboard" replace />} />
//             </Route>
//           </Routes>
//         </div>
//       </Router>
//     </>
//   );
// };

// export default App;
// =======
// Enhanced App.tsx - Key fixes marked with 
// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Component Imports
// import ProtectedRoute from "./components/ProtectedRoute";
// import Breadcrumb from "./components/Breadcrumb";
// import SocialProfileCompletion from "./components/SocialProfileCompletion";
// import Preferences from "./components/Preferences";

// // Cookie Preferences Import
// import { CookiePreferencesManager } from "./utils/cookiePreferences";


// // Pages Imports
// import DashboardHome from "./pages/Dashboard";
// import AssignmentPage from "./pages/Assignments";
// import EvaluationsPage from "./pages/Evaluations";
// import AnalyticsPage from "./pages/Analytics";
// import AchievementsPage from "./pages/Achievements";
// import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import GoToStudentProfile from "./pages/GoToStudentProfile";
// import GoToTeacherProfile from "./pages/GoToTeacherProfile";
// import Courses from "./pages/Courses";
// import StudentsPage from "./pages/Students";

// // Admin Components
// import AdminUserManagement from "./pages/AdminUserManagement";
// import AdminSystemSettings from "./pages/AdminSystemSettings";

// // Context Imports
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ToastProvider } from "./contexts/ToastContext";
// import { AnalyticsProvider } from "./contexts/AnalyticsContext";
// import { StreakProvider } from "./contexts/StreakContext";
// import ToastContainer from "./components/ToastContainer";
// import { useAuth } from "./contexts/AuthContext";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// //  NEW: Complete Profile Page component
// const CompleteProfilePage: React.FC = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-2xl w-full">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Complete Your Profile
//         </h2>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//           Please provide additional information to complete your account setup
//         </p>
//       </div>
//       <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
//         <p className="text-blue-800 dark:text-blue-200">
//           Profile completion form will be implemented here based on your
//           requirements.
//         </p>
//       </div>
//     </div>
//   </div>
// );

// function App() {
//   // Initialize cookie preferences on app startup
//   useEffect(() => {
//     CookiePreferencesManager.initializePreferences();
//   }, []);

//   // Get Google Client ID from environment
//   const GOOGLE_CLIENT_ID =
//     import.meta.env.VITE_GOOGLE_CLIENT_ID ||
//     "10314053648-9i01d2gvt3qpspm6elmapdpakishbco9.apps.googleusercontent.com";

//   if (!GOOGLE_CLIENT_ID) {
//     console.warn("⚠️ VITE_GOOGLE_CLIENT_ID not found in environment variables");
//   }

//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
//       <ThemeProvider>
//         <ToastProvider>
//           <AuthProvider>
//             <AnalyticsProvider>
//               <StreakProvider>
//                 <AppContent />
//               </StreakProvider>
//             </AnalyticsProvider>
//           </AuthProvider>
//         </ToastProvider>
//       </ThemeProvider>
//     </GoogleOAuthProvider>
//   );
// }

// // Wrapper component to handle social profile completion
// const AppContent: React.FC = () => {
//   const { state, completeSocialProfile } = useAuth();
//   const [showProfileCompletion, setShowProfileCompletion] = useState(false);

//   //  ENHANCED: Better profile completion detection
//   useEffect(() => {
//     console.log("🔍 Checking if profile completion modal should be shown:", {
//       isAuthenticated: state.isAuthenticated,
//       needsProfileCompletion: state.needsProfileCompletion,
//       user: state.user?.userName,
//     });

//     if (state.isAuthenticated && state.needsProfileCompletion && state.user) {
//       console.log("📋 Showing profile completion modal");
//       setShowProfileCompletion(true);
//     } else {
//       setShowProfileCompletion(false);
//     }
//   }, [state.isAuthenticated, state.needsProfileCompletion, state.user]);

//   useEffect(() => {
//     // Apply theme from cookie on app load
//     const savedTheme = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("theme="))
//       ?.split("=")[1];

//     if (savedTheme) {
//       document.documentElement.setAttribute("data-theme", savedTheme);
//     }
//   }, []);

//   //  ENHANCED: Better profile completion handling
//   const handleProfileComplete = async (data: any) => {
//     try {
//       console.log("🔍 Completing social profile with data:", data);
//       await completeSocialProfile(data);
//       setShowProfileCompletion(false);
//       console.log("✅ Profile completion successful");
//     } catch (error) {
//       console.error("❌ Profile completion failed:", error);
//       // Don't close the modal on error, let user try again
//     }
//   };

//   const handleProfileCancel = () => {
//     // Log the user out if they cancel profile completion
//     console.log("🚫 User cancelled profile completion, logging out");
//     setShowProfileCompletion(false);
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       <Router>
//         <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
//           {/* Toast container - render outside Routes */}
//           <ToastContainer />

//           {/* ✅ ENHANCED: Social profile completion modal with better conditional rendering */}
//           {showProfileCompletion && state.user && (
//             <SocialProfileCompletion
//               onComplete={handleProfileComplete}
//               onCancel={handleProfileCancel}
//             />
//           )}

//           {/* Global Preferences Component */}
//           <Preferences />

//           <Routes>
//             {/* Public routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Complete profile route */}
//             <Route
//               path="/complete-profile"
//               element={
//                 <ProtectedRoute>
//                   <CompleteProfilePage />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Protected routes with layout */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Breadcrumb />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<Navigate to="/dashboard" replace />} />
//               <Route path="dashboard" element={<DashboardHome />} />
//               <Route path="courses" element={<Courses />} />
//               <Route path="find-student" element={<GoToStudentProfile />} />
//               <Route path="find-teacher" element={<GoToTeacherProfile />} />
//               <Route path="assignments" element={<AssignmentPage />} />
//               <Route path="evaluations" element={<EvaluationsPage />} />
//               <Route path="analytics" element={<AnalyticsPage />} />
//               <Route path="achievements" element={<AchievementsPage />} />
//               <Route path="profile" element={<ProfilePage />} />
//               <Route path="profile/:userId" element={<ProfilePage />} />
//               <Route path="settings" element={<SettingsPage />} />
//               <Route path="students" element={<StudentsPage />} />

//               {/* Admin-only routes */}
//               <Route
//                 path="admin/users"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminUserManagement />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="admin/system"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminSystemSettings />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Fallback for undefined routes */}
//               <Route path="*" element={<Navigate to="/dashboard" replace />} />
//             </Route>
//           </Routes>
//         </div>
//       </Router>
//     </>
//   );
// };

// export default App;

// ======================================================================= //

// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Component Imports
// import ProtectedRoute from "./components/ProtectedRoute";
// import Breadcrumb from "./components/Breadcrumb";
// import SocialProfileCompletion from "./components/SocialProfileCompletion";
// import Preferences from "./components/Preferences";

// // Pages Imports
// import DashboardHome from "./pages/Dashboard";
// import AssignmentPage from "./pages/Assignments";
// import EvaluationsPage from "./pages/Evaluations";
// import AnalyticsPage from "./pages/Analytics";
// import AchievementsPage from "./pages/Achievements";
// import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import GoToStudentProfile from "./pages/GoToStudentProfile";
// import Courses from "./pages/Courses";

// // Context Imports
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ToastProvider } from "./contexts/ToastContext";
// import ToastContainer from "./components/ToastContainer";
// import { useAuth } from "./contexts/AuthContext";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// // Admin Components
// const AdminUserManagement: React.FC = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//       User Management
//     </h1>
//     <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
//       <p className="text-gray-600 dark:text-gray-400">
//         Admin user management interface - coming soon...
//       </p>
//     </div>
//   </div>
// );

// const AdminSystemSettings: React.FC = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//       System Settings
//     </h1>
//     <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
//       <p className="text-gray-600 dark:text-gray-400">
//         System settings interface - coming soon...
//       </p>
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <ThemeProvider>
//       <ToastProvider>
//           <AuthProvider>
//             <AppContent />
//           </AuthProvider>
//         </ToastProvider>
//     </ThemeProvider>
//   );
// }

// // Wrapper component to handle social profile completion
// const AppContent: React.FC = () => {
//   const { state, completeSocialProfile } = useAuth();
//   const [showProfileCompletion, setShowProfileCompletion] = useState(false);

//   useEffect(() => {
//     if (state.isAuthenticated && state.needsProfileCompletion) {
//       setShowProfileCompletion(true);
//     }
//   }, [state.isAuthenticated, state.needsProfileCompletion]);

//   useEffect(() => {
//     // Apply theme from cookie on app load
//     const savedTheme = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("theme="))
//       ?.split("=")[1];

//     if (savedTheme) {
//       document.documentElement.setAttribute("data-theme", savedTheme);
//     }
//   }, []);

//   const handleProfileComplete = async (data: any) => {
//     try {
//       await completeSocialProfile(data);
//       setShowProfileCompletion(false);
//     } catch (error) {
//       console.error("Profile completion failed:", error);
//     }
//   };

//   const handleProfileCancel = () => {
//     // Log the user out if they cancel profile completion
//     setShowProfileCompletion(false);
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       <Router>
//         <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
//           {/* Toast container - render outside Routes */}
//           <ToastContainer />

//           {/* Social profile completion modal */}
//           {showProfileCompletion && (
//             <SocialProfileCompletion
//               onComplete={handleProfileComplete}
//               onCancel={handleProfileCancel}
//             />
//           )}

//           {/* Global Preferences Component */}
//           <Preferences />

//           <Routes>
//             {/* Public routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Protected routes with layout */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Breadcrumb />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<Navigate to="/dashboard" replace />} />
//               <Route path="dashboard" element={<DashboardHome />} />
//               <Route path="courses" element={<Courses />} />
//               <Route path="find-student" element={<GoToStudentProfile />} />
//               <Route path="assignments" element={<AssignmentPage />} />
//               <Route path="evaluations" element={<EvaluationsPage />} />
//               <Route path="analytics" element={<AnalyticsPage />} />
//               <Route path="achievements" element={<AchievementsPage />} />
//               <Route path="profile" element={<ProfilePage />} />
//               <Route path="profile/:userId" element={<ProfilePage />} />
//               <Route path="settings" element={<SettingsPage />} />

//               {/* Admin-only routes */}
//               <Route
//                 path="admin/users"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminUserManagement />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="admin/system"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminSystemSettings />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Fallback for undefined routes */}
//               <Route path="*" element={<Navigate to="/dashboard" replace />} />
//             </Route>
//           </Routes>
//         </div>
//       </Router>
//     </>
//   );
// };

// export default App;

