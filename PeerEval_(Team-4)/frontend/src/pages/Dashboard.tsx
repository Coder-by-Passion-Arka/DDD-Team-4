// import React from 'react';
// import {
//   BookOpen,
//   Clock,
//   Target,
//   CheckCircle,
// } from 'lucide-react';
// import StatsCard from '../components/StatsCard';
// import ProgressChart from '../components/ProgressChart';
// import StreakCounter from '../components/StreakCounter';
// import RecentAssignments from '../components/RecentAssignments';

// const Dashboard: React.FC = () => {
//   const stats = {
//     submitted: 24,
//     inProgress: 3,
//     toEvaluate: 7,
//     completed: 180,
//   };

//   const dailyProgress = [
//     { day: 'Mon', submissions: 4, evaluations: 2 },
//     { day: 'Tue', submissions: 6, evaluations: 3 },
//     { day: 'Wed', submissions: 3, evaluations: 5 },
//     { day: 'Thu', submissions: 8, evaluations: 4 },
//     { day: 'Fri', submissions: 5, evaluations: 6 },
//     { day: 'Sat', submissions: 2, evaluations: 1 },
//     { day: 'Sun', submissions: 3, evaluations: 2 },
//   ];

//   return (
//     <>
//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
//           Evaluation Dashboard
//         </h1>
//         <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
//           Track your peer evaluation progress and assignments with real-time insights
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         <StatsCard
//           title="Total Submitted"
//           value={stats.submitted}
//           icon={CheckCircle}
//           color="emerald"
//           trend="+12%"
//         />
//         <StatsCard
//           title="In Progress"
//           value={stats.inProgress}
//           icon={Clock}
//           color="amber"
//           trend="-5%"
//         />
//         <StatsCard
//           title="To Evaluate"
//           value={stats.toEvaluate}
//           icon={Target}
//           color="blue"
//           trend="+8%"
//         />
//         <StatsCard
//           title="Completed"
//           value={stats.completed}
//           icon={BookOpen}
//           color="purple"
//           trend="+23%"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
//         <div className="lg:col-span-2">
//           <ProgressChart data={dailyProgress} />
//         </div>
//         <div id="streak-section" className="transition-all duration-300 rounded-2xl">
//           <StreakCounter currentStreak={12} bestStreak={28} />
//         </div>
//       </div>

//       <RecentAssignments />
//     </>
//   );
// };

// export default Dashboard;

// ================================================================ //

import React, { useState, useEffect } from "react";

// Custom SVG Icons to replace problematic lucide-react imports
const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Loader2Icon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const BarChartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
import StatsCard from "../components/StatsCard";
import ProgressChart from "../components/ProgressChart";
import StreakCounter from "../components/StreakCounter";
import RecentAssignments from "../components/RecentAssignments";
import { useAuth } from "../contexts/AuthContext";
// import { apiService } from "../services/api";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useToast } from "../hooks/useToast";
import SocialProfileCompletion from "../components/SocialProfileCompletion";

interface DashboardStats {
  submitted: number;
  inProgress: number;
  toEvaluate: number;
  completed: number;
}

interface TeacherStats {
  totalStudents: number;
  activeAssignments: number;
  pendingEvaluations: number;
  coursesManaged: number;
}

interface AdminStats {
  totalUsers: number;
  activeTeachers: number;
  totalStudents: number;
  systemHealth: number;
}

interface DashboardData {
  stats: DashboardStats | TeacherStats | AdminStats;
  dailyProgress: Array<{
    day: string;
    submissions: number;
    evaluations: number;
  }>;
  currentStreak: number;
  bestStreak: number;
}

const Dashboard: React.FC = () => {
  const { state, googleLogin, googleLogout } = useAuth();
  const toast = useToast();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user role, defaulting to student if not set
  const userRole = state.user?.userRole || "student";

  // Check if profile completion is needed
  useEffect(() => {
    if (state?.needsProfileCompletion) {
      setShowProfileCompletion(true);
    }
  }, [state.needsProfileCompletion]);

  // Dashboard data fetch using useEffect
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!state.user) return;

      try {
        setIsLoading(true);

        // Mock data based on user role
        let mockData: DashboardData;

        switch (userRole) {
          case "teacher":
            mockData = {
              stats: {
                totalStudents: Math.floor(Math.random() * 30) + 30, // 30-60 students
                activeAssignments: Math.floor(Math.random() * 8) + 5, // 5-12 assignments
                pendingEvaluations: Math.floor(Math.random() * 25) + 10, // 10-35 pending
                coursesManaged: Math.floor(Math.random() * 4) + 2, // 2-5 courses
              } as TeacherStats,
              dailyProgress: [
                {
                  day: "Mon",
                  submissions: Math.floor(Math.random() * 15) + 8,
                  evaluations: Math.floor(Math.random() * 12) + 5,
                },
                {
                  day: "Tue",
                  submissions: Math.floor(Math.random() * 18) + 10,
                  evaluations: Math.floor(Math.random() * 15) + 8,
                },
                {
                  day: "Wed",
                  submissions: Math.floor(Math.random() * 12) + 6,
                  evaluations: Math.floor(Math.random() * 18) + 10,
                },
                {
                  day: "Thu",
                  submissions: Math.floor(Math.random() * 20) + 12,
                  evaluations: Math.floor(Math.random() * 14) + 7,
                },
                {
                  day: "Fri",
                  submissions: Math.floor(Math.random() * 16) + 10,
                  evaluations: Math.floor(Math.random() * 20) + 12,
                },
                {
                  day: "Sat",
                  submissions: Math.floor(Math.random() * 8) + 3,
                  evaluations: Math.floor(Math.random() * 5) + 2,
                },
                {
                  day: "Sun",
                  submissions: Math.floor(Math.random() * 10) + 4,
                  evaluations: Math.floor(Math.random() * 6) + 3,
                },
              ],
              currentStreak: Math.floor(Math.random() * 25) + 10, // 10-35 day streak
              bestStreak: Math.floor(Math.random() * 60) + 30, // 30-90 day best streak
            };
            break;

          case "admin":
            mockData = {
              stats: {
                totalUsers: Math.floor(Math.random() * 500) + 1000, // 1000-1500 users
                activeTeachers: Math.floor(Math.random() * 15) + 20, // 20-35 teachers
                totalStudents: Math.floor(Math.random() * 400) + 1000, // 1000-1400 students
                systemHealth: Math.floor(Math.random() * 5) + 95, // 95-100% health
              } as AdminStats,
              dailyProgress: [
                {
                  day: "Mon",
                  submissions: Math.floor(Math.random() * 30) + 35,
                  evaluations: Math.floor(Math.random() * 25) + 25,
                },
                {
                  day: "Tue",
                  submissions: Math.floor(Math.random() * 35) + 40,
                  evaluations: Math.floor(Math.random() * 30) + 30,
                },
                {
                  day: "Wed",
                  submissions: Math.floor(Math.random() * 25) + 30,
                  evaluations: Math.floor(Math.random() * 35) + 35,
                },
                {
                  day: "Thu",
                  submissions: Math.floor(Math.random() * 40) + 45,
                  evaluations: Math.floor(Math.random() * 28) + 28,
                },
                {
                  day: "Fri",
                  submissions: Math.floor(Math.random() * 32) + 35,
                  evaluations: Math.floor(Math.random() * 40) + 40,
                },
                {
                  day: "Sat",
                  submissions: Math.floor(Math.random() * 20) + 15,
                  evaluations: Math.floor(Math.random() * 15) + 12,
                },
                {
                  day: "Sun",
                  submissions: Math.floor(Math.random() * 22) + 18,
                  evaluations: Math.floor(Math.random() * 18) + 15,
                },
              ],
              currentStreak: Math.floor(Math.random() * 40) + 20, // 20-60 day streak
              bestStreak: Math.floor(Math.random() * 70) + 50, // 50-120 day best streak
            };
            break;

          default: // student
            mockData = {
              stats: {
                submitted: Math.floor(Math.random() * 15) + 10, // 10-25 submitted
                inProgress: Math.floor(Math.random() * 5) + 1, // 1-5 in progress
                toEvaluate: Math.floor(Math.random() * 8) + 3, // 3-10 to evaluate
                completed: Math.floor(Math.random() * 20) + 15, // 15-35 completed
              } as DashboardStats,
              dailyProgress: [
                // Current week - more realistic varying data
                {
                  day: "Mon",
                  submissions: Math.floor(Math.random() * 8) + 2,
                  evaluations: Math.floor(Math.random() * 6) + 1,
                },
                {
                  day: "Tue",
                  submissions: Math.floor(Math.random() * 10) + 3,
                  evaluations: Math.floor(Math.random() * 8) + 2,
                },
                {
                  day: "Wed",
                  submissions: Math.floor(Math.random() * 6) + 1,
                  evaluations: Math.floor(Math.random() * 12) + 3,
                },
                {
                  day: "Thu",
                  submissions: Math.floor(Math.random() * 12) + 4,
                  evaluations: Math.floor(Math.random() * 7) + 2,
                },
                {
                  day: "Fri",
                  submissions: Math.floor(Math.random() * 9) + 3,
                  evaluations: Math.floor(Math.random() * 10) + 4,
                },
                {
                  day: "Sat",
                  submissions: Math.floor(Math.random() * 4) + 1,
                  evaluations: Math.floor(Math.random() * 3) + 1,
                },
                {
                  day: "Sun",
                  submissions: Math.floor(Math.random() * 5) + 1,
                  evaluations: Math.floor(Math.random() * 4) + 1,
                },
                // // Week-2
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-3
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-4
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Month-2
                // // Week-1
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-2
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-3
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-4
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Month-4
                // // Week-1
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-2
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-3
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-4
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Month-3
                // // Week-1
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-2
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-3
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
                // // Week-4
                // { day: "Mon", submissions: 4, evaluations: 2 },
                // { day: "Tue", submissions: 6, evaluations: 3 },
                // { day: "Wed", submissions: 3, evaluations: 5 },
                // { day: "Thu", submissions: 8, evaluations: 4 },
                // { day: "Fri", submissions: 5, evaluations: 6 },
                // { day: "Sat", submissions: 2, evaluations: 1 },
                // { day: "Sun", submissions: 3, evaluations: 2 },
              ],
              currentStreak: Math.floor(Math.random() * 20) + 5, // 5-25 day streak
              bestStreak: Math.floor(Math.random() * 50) + 25, // 25-75 day best streak
            };
        }

        // // Simulate API call delay
        // await new Promise((resolve) => setTimeout(resolve, 800));

        // TODO: Replace with actual API calls when backend endpoints are ready
        /*
        const response = await apiService.get(`/user/dashboard/${userRole}`);
        const actualData: DashboardData = response.data;
        */

        setDashboardData(mockData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [state.user, userRole]);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed - no credential received");
      return;
    }

    try {
      await toast.promise(googleLogin(credentialResponse.credential), {
        loading: "Signing you in with Google...",
        success: "Google authentication successful! Welcome!",
        error: (err) => `Google authentication failed: ${err.message}`,
      });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google authentication failed. Please try again.", {
      title: "Authentication Error",
    });
  };

  const handleProfileCompletionComplete = () => {
    setShowProfileCompletion(false);
    toast.success("Profile completed successfully! Welcome to your dashboard.");
  };

  const handleProfileCompletionCancel = () => {
    // Allow user to cancel but show a warning
    toast.warning(
      "Profile completion is required for full access to features."
    );
    setShowProfileCompletion(false);
  };

  const handleLogout = async () => {
    try {
      await googleLogout();
    } catch (error) {
      console.error("Google Logout error:", error);
    }
  };

  // Show profile completion modal if needed
  if (showProfileCompletion) {
    return (
      <SocialProfileCompletion
        onComplete={handleProfileCompletionComplete}
        onCancel={handleProfileCompletionCancel}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No dashboard data available
        </p>
      </div>
    );
  }

  // Render based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case "teacher":
        return renderTeacherDashboard();
      case "admin":
        return renderAdminDashboard();
      default:
        return renderStudentDashboard();
    }
  };
  // Student Dashboard
  const renderStudentDashboard = () => {
    const stats = dashboardData.stats as DashboardStats;

    return (
      <>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
            Welcome back, {state.user?.userName || "Student"}!
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
            Track your peer evaluation progress and assignments with real-time
            insights
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Show Google Login if not authenticated */}
          {!state.isAuthenticated && (
            <div className="hidden sm:block">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="medium"
                text="signin_with"
                shape="rectangular"
                locale="en"
              />
            </div>
          )}

          {/* User Info and Logout */}
          {state.isAuthenticated && (
            <div className="flex items-center space-x-4">
              {state.user?.userProfileImage && (
                <img
                  src={state.user.userProfileImage}
                  alt={state.user.userName}
                  className="w-8 h-8 rounded-full border border-gray-600 dark:border-gray-300"
                />
              )}
              <span className="md:text-sm font-bold text-gray-700 dark:text-gray-300">
                {state.user?.userName}
              </span>
              <button
                onClick={handleLogout}
                className="md:text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* User Status Info */}
        {state.user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 m-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="md:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email:
                </span>
                <p className="md:text-sm text-gray-900 dark:text-white">
                  {state.user.userEmail}
                </p>
              </div>
              <div>
                <span className="md:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role:
                </span>
                <p className="md:text-sm text-gray-900 dark:text-white capitalize">
                  {state.user.userRole}
                </p>
              </div>
              <div>
                <span className="md:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Auth Provider:
                </span>
                <p className="md:text-sm text-gray-900 dark:text-white capitalize">
                  {state.user.authProvider || "Local Sigin"}
                </p>
              </div>
              {state.user.userPhoneNumber && (
                <div>
                  <span className="md:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phone:
                  </span>
                  <p className="md:text-sm text-gray-900 dark:text-white">
                    {state.user.countryCode} {state.user.userPhoneNumber}
                  </p>
                </div>
              )}
              {state.user.userLocation?.homeAddress && (
                <div>
                  <span className="md:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Address:
                  </span>
                  <p className="md:text-sm text-gray-900 dark:text-white">
                    {state.user.userLocation.homeAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions for Mobile Google Login */}
        {!state.isAuthenticated && (
          <div className="block sm:hidden mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Sign In
              </h2>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                locale="en"
              />
            </div>
          </div>
        )}

        {/* Profile Completion Warning */}
        {state.needsProfileCompletion && !showProfileCompletion && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please complete your profile to access all features.{" "}
                  <button
                    onClick={() => setShowProfileCompletion(true)}
                    className="font-medium underline hover:text-yellow-600 dark:hover:text-yellow-100"
                  >
                    Complete now
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Statistics for different progress of Assignments*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Submitted"
            value={stats.submitted}
            icon={CheckCircleIcon}
            color="emerald"
            trend={stats.submitted > 0 ? "+1%" : "0%"} // TODO: Need to retrieve them from the backend API
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={ClockIcon}
            color="amber"
            trend={stats.inProgress > 0 ? "-5%" : "0%"} // TODO: Need to retrieve them from the backend API
          />
          <StatsCard
            title="To Evaluate"
            value={stats.toEvaluate}
            icon={TargetIcon}
            color="blue"
            trend={stats.toEvaluate > 0 ? "+8%" : "0%"} // TODO: Need to retrieve them from the backend API
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={BookOpenIcon}
            color="purple"
            trend={stats.completed > 0 ? "+3%" : "0%"} // TODO: Need to retrieve them from the backend API
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <ProgressChart />
          </div>
          <div className="transition-all duration-300 rounded-2xl">
            <StreakCounter
              currentStreak={dashboardData.currentStreak}
              bestStreak={dashboardData.bestStreak}
            />
          </div>
        </div>

        <RecentAssignments />

        {/* Welcome message for new users */}
        {stats.submitted === 0 && stats.completed === 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to the Peer Evaluation System! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get started by checking the Assignments page for tasks to
                complete, or explore your profile to add more information about
                yourself.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => (window.location.href = "/assignments")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Assignments
                </button>
                <button
                  onClick={() => (window.location.href = "/profile")}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Teacher Dashboard
  const renderTeacherDashboard = () => {
    const stats = dashboardData.stats as TeacherStats;

    return (
      <>
        {/* Enable Google Login */}
        <GoogleLogin
          // clientId={process.env.GOOGLE_CLIENT_ID}
          // clientSecret={process.env.GOOGLE_CLIENT_SECRET}
          onSuccess={() => console.log("Success")} // TODO: make a toast of Login success here
          onError={() => {
            window.location.href = "/login";
          }} //  TODO: Make a Toast of login failure here
          // cookiePolicy={"single_host_origin"}
          // isSignedIn={true}
        />

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-300 dark:to-blue-100 bg-clip-text text-transparent mb-2 sm:mb-3">
            Teacher Dashboard - {state.user?.userName || "Teacher"}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
            Manage your courses, assignments, and track student progress
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={UsersIcon}
            color="blue"
            trend="+5%"
          />
          <StatsCard
            title="Active Assignments"
            value={stats.activeAssignments}
            icon={BookOpenIcon}
            color="emerald"
            trend="+2"
          />
          <StatsCard
            title="Pending Evaluations"
            value={stats.pendingEvaluations}
            icon={ClockIcon}
            color="amber"
            trend="-8%"
          />
          <StatsCard
            title="Courses Managed"
            value={stats.coursesManaged}
            icon={TargetIcon}
            color="purple"
            trend="0%"
          />
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <ProgressChart data={dashboardData.dailyProgress} />
          </div>
          <div className="transition-all duration-300 rounded-2xl">
            <StreakCounter
              currentStreak={dashboardData.currentStreak}
              bestStreak={dashboardData.bestStreak}
            />
          </div>
        </div> */}

        {/* Teacher-specific features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              🎯 Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/assignments/create")}
                className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Assignment
              </button>
              <button
                onClick={() => (window.location.href = "/students")}
                className="w-full text-left px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Manage Students
              </button>
              <button
                onClick={() => (window.location.href = "/evaluations/pending")}
                className="w-full text-left px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Review Pending Evaluations
              </button>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 text-xl">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
              📊 Class Overview
            </h3>
            <div className="space-y-2 md:text-sm text-emerald-800 dark:text-emerald-200 text-xl">
              <p>
                • {stats.totalStudents} students across {stats.coursesManaged}{" "}
                courses
              </p>
              <p>• {stats.activeAssignments} assignments currently active</p>
              <p>
                • {stats.pendingEvaluations} evaluations awaiting your review
              </p>
              <p>• {dashboardData.currentStreak} day teaching streak!</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Admin Dashboard
  const renderAdminDashboard = () => {
    const stats = dashboardData.stats as AdminStats;

    return (
      <>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-900 to-red-600 dark:from-red-300 dark:to-red-100 bg-clip-text text-transparent mb-2 sm:mb-3">
            Admin Dashboard - {state.user?.userName || "Administrator"}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
            System overview and platform management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={UsersIcon}
            color="purple"
            trend="+12%"
          />
          <StatsCard
            title="Active Teachers"
            value={stats.activeTeachers}
            icon={BookOpenIcon}
            color="blue"
            trend="+3"
          />
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={TargetIcon}
            color="emerald"
            trend="+8%"
          />
          <StatsCard
            title="System Health"
            value={stats.systemHealth}
            icon={BarChartIcon}
            color="amber"
            trend="+2%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <ProgressChart />
          </div>
          <div className="transition-all duration-300 rounded-2xl">
            <StreakCounter
              currentStreak={dashboardData.currentStreak}
              bestStreak={dashboardData.bestStreak}
            />
          </div>
        </div>

        {/* Admin-specific features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
              🛡️ System Management
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/admin/users")}
                className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Manage Users
              </button>
              <button
                onClick={() => (window.location.href = "/admin/system")}
                className="w-full text-left px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                System Settings
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📈 Platform Stats
            </h3>
            <div className="space-y-2 md:text-sm text-blue-800 dark:text-blue-200 text-xl">
              <p>• {stats.totalUsers} total platform users</p>
              <p>• {stats.activeTeachers} active teachers</p>
              <p>• {stats.totalStudents} enrolled students</p>
              <p>• {stats.systemHealth}% system uptime</p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
              ⚡ Quick Reports
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/admin/reports/usage")}
                className="w-full text-left px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Usage Analytics
              </button>
              <button
                onClick={() =>
                  (window.location.href = "/admin/reports/performance")
                }
                className="w-full text-left px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Performance Reports
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return <>{renderDashboard()}</>;
};

export default Dashboard;