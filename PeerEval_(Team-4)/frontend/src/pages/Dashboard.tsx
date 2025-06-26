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

// ========================

import React, { useState, useEffect } from "react";
import { BookOpen, Clock, Target, CheckCircle, Loader2 } from "lucide-react";
import StatsCard from "../components/StatsCard";
import ProgressChart from "../components/ProgressChart";
import StreakCounter from "../components/StreakCounter";
import RecentAssignments from "../components/RecentAssignments";
import BadgesSection from "../components/BadgesSection";
import DailyGoals from "../components/DailyGoals";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

interface DashboardStats {
  submitted: number;
  inProgress: number;
  toEvaluate: number;
  completed: number;
}

interface DashboardData {
  stats: DashboardStats;
  dailyProgress: Array<{
    day: string;
    submissions: number;
    evaluations: number;
  }>;
  currentStreak: number;
  bestStreak: number;
}

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!state.user) return;

      try {
        setIsLoading(true);

        // For now, we'll use mock data since the backend endpoints might not exist yet
        // In production, replace this with actual API calls
        const mockData: DashboardData = {
          stats: {
            submitted: 0,
            inProgress: 0,
            toEvaluate: 0,
            completed: 0,
          },
          dailyProgress: [
            { day: "Mon", submissions: 0, evaluations: 0 },
            { day: "Tue", submissions: 0, evaluations: 0 },
            { day: "Wed", submissions: 0, evaluations: 0 },
            { day: "Thu", submissions: 0, evaluations: 0 },
            { day: "Fri", submissions: 0, evaluations: 0 },
            { day: "Sat", submissions: 0, evaluations: 0 },
            { day: "Sun", submissions: 0, evaluations: 0 },
          ],
          currentStreak: 0,
          bestStreak: 0,
        };

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // TODO: Replace with actual API calls when backend endpoints are ready
        /*
        const [statsResponse, progressResponse, streakResponse] = await Promise.all([
          apiService.get('/user/dashboard/stats'),
          apiService.get('/user/dashboard/progress'),
          apiService.get('/user/dashboard/streak')
        ]);
        
        const actualData: DashboardData = {
          stats: statsResponse.data,
          dailyProgress: progressResponse.data,
          currentStreak: streakResponse.data.currentStreak,
          bestStreak: streakResponse.data.bestStreak,
        };
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
  }, [state.user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
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

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
          Welcome back, {state.user?.userName || "User"}!
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
          Track your peer evaluation progress and assignments with real-time
          insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Submitted"
          value={dashboardData.stats.submitted}
          icon={CheckCircle}
          color="emerald"
          trend={dashboardData.stats.submitted > 0 ? "+12%" : "0%"}
        />
        <StatsCard
          title="In Progress"
          value={dashboardData.stats.inProgress}
          icon={Clock}
          color="amber"
          trend={dashboardData.stats.inProgress > 0 ? "-5%" : "0%"}
        />
        <StatsCard
          title="To Evaluate"
          value={dashboardData.stats.toEvaluate}
          icon={Target}
          color="blue"
          trend={dashboardData.stats.toEvaluate > 0 ? "+8%" : "0%"}
        />
        <StatsCard
          title="Completed"
          value={dashboardData.stats.completed}
          icon={BookOpen}
          color="purple"
          trend={dashboardData.stats.completed > 0 ? "+23%" : "0%"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <ProgressChart data={dashboardData.dailyProgress} />
        </div>
        <div
          id="streak-section"
          className="transition-all duration-300 rounded-2xl"
        >
          <StreakCounter
            currentStreak={dashboardData.currentStreak}
            bestStreak={dashboardData.bestStreak}
          />
        </div>
      </div>

      <RecentAssignments />

      {/* Welcome message for new users */}
      {dashboardData.stats.submitted === 0 &&
        dashboardData.stats.completed === 0 && (
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

      {/* User role specific information */}
      {state.user?.userRole === "teacher" && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Teacher Dashboard
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            As a teacher, you have access to additional features for managing
            assignments and evaluating student submissions.
          </p>
        </div>
      )}

      {state.user?.userRole === "admin" && (
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
            Admin Dashboard
          </h3>
          <p className="text-purple-800 dark:text-purple-200">
            You have administrative access to manage users, assignments, and
            system settings.
          </p>
        </div>
      )}
    </>
  );
};

export default Dashboard;