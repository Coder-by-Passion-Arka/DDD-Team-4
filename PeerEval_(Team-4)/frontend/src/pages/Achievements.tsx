// codebase
// import React from 'react';
// import { motion } from 'framer-motion';
// import { ScrollText, Medal, Globe } from "lucide-react"; 

// const achievements = [
//   {
//     title: 'Winner - AI Hackathon 2024',
//     description: 'Led a 4-member team to build a chatbot that won 1st prize at national level.',
//     icon: Medal
//   },
//   {
//     title: 'Certificate of Excellence - Java',
//     description: 'Achieved 98% in Oracle Certified Java Programmer Course.',
//     icon: ScrollText
//   },
//   {
//     title: ' Web Dev Star - Bootcamp 2023',
//     description: 'Completed a full-stack bootcamp and built 3 live projects with MERN stack.',
//     icon: Globe
//   },
// ];

// const Achievements: React.FC = () => {
//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-yellow-50 to-pink-100 dark:bg-gradient-to-br dark:to-pink-500 dark:from-purple-900 min-h-screen rounded-xl">
//       {/* Header */}
//       <div className="mb-6 sm:mb-8 lg:mb-10">
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-pink-700 dark:text-amber-600 mb-2 sm:mb-3">
//           🏆 Achievements
//         </h1>
//         <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
//           Celebrate your accomplishments and milestones
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
//         {achievements.map((item, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: idx * 0.2 }}
//             className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-pink-200 dark:bg-purple-500 dark:border-white dark:hover:shadow-lg dark:hover:shadow-slate-700/50 ease-in-out delay-150 duration-300"
//           >
//             <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
//               <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-600 dark:from-amber-500 dark:to-yellow-600 rounded-xl flex items-center justify-center">
//                 <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2 leading-tight">
//                   {item.title}
//                 </h2>
//               </div>
//             </div>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-amber-300 leading-relaxed">
//               {item.description}
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Achievement Stats */}
//       <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//           <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
//             <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
//               {achievements.length}
//             </div>
//             <div className="text-sm sm:text-base text-gray-600 dark:text-white">
//               Total Achievements
//             </div>
//           </div>
//           <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
//             <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
//               2024
//             </div>
//             <div className="text-sm sm:text-base text-gray-600 dark:text-white">
//               Latest Achievement
//             </div>
//           </div>
//           <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
//             <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
//               98%
//             </div>
//             <div className="text-sm sm:text-base text-gray-600 dark:text-white">
//               Highest Score
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Achievements;

// ====================== // 

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ScrollText,
  Medal,
  Globe,
  Loader2,
  Trophy,
  Award,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "Medal" | "ScrollText" | "Globe" | "Trophy" | "Award" | "Star";
  earnedAt: string;
  category?: string;
  points?: number;
}

const iconMap = {
  Medal,
  ScrollText,
  Globe,
  Trophy,
  Award,
  Star,
};

const Achievements: React.FC = () => {
  const { state } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!state.user) return;

      try {
        setIsLoading(true);

        // For now, we'll use empty array since backend endpoints might not exist yet
        // In production, replace this with actual API calls
        const mockAchievements: Achievement[] = [];

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // TODO: Replace with actual API call when backend endpoint is ready
        /*
        const response = await apiService.get('/user/achievements');
        const actualAchievements: Achievement[] = response.data;
        */

        setAchievements(mockAchievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError("Failed to load achievements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [state.user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading achievements...
          </p>
        </div>
      </div>
    );
  }

  const totalPoints = achievements.reduce(
    (sum, achievement) => sum + (achievement.points || 0),
    0
  );
  const latestAchievement =
    achievements.length > 0
      ? achievements.sort(
          (a, b) =>
            new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
        )[0]
      : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-yellow-50 to-pink-100 dark:bg-gradient-to-br dark:to-pink-500 dark:from-purple-900 min-h-screen rounded-xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-pink-700 dark:text-amber-600 mb-2 sm:mb-3">
          🏆 Achievements
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
          Celebrate your accomplishments and milestones
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-800 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Achievements Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start completing assignments, participating in evaluations, and
            engaging with the platform to earn your first achievements!
          </p>

          {/* Achievement Categories Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl mx-auto border border-gray-200 dark:border-gray-700">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Ways to Earn Achievements
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                  <ScrollText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Academic Excellence
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete assignments, score high on evaluations, and maintain
                  consistent performance
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                  <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Peer Collaboration
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provide helpful feedback, participate in peer reviews, and
                  contribute to the community
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                  <Medal className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Platform Milestones
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete your profile, maintain streaks, and reach platform
                  usage milestones
                </p>
              </div>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => (window.location.href = "/assignments")}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
            >
              Start with Assignments
            </button>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Complete Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {achievements.map((achievement, idx) => {
            const IconComponent = iconMap[achievement.icon] || Medal;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-pink-200 dark:bg-purple-500 dark:border-white dark:hover:shadow-lg dark:hover:shadow-slate-700/50 ease-in-out delay-150 duration-300"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-purple-600 dark:from-amber-500 dark:to-yellow-600 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2 leading-tight">
                      {achievement.title}
                    </h2>
                    {achievement.category && (
                      <span className="inline-block px-2 py-1 bg-pink-100 dark:bg-amber-900/30 text-pink-800 dark:text-amber-200 rounded-full text-xs font-medium mb-2">
                        {achievement.category}
                      </span>
                    )}
                  </div>
                  {achievement.points && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-pink-600 dark:text-amber-400">
                        +{achievement.points}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        points
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-amber-300 leading-relaxed mb-3">
                  {achievement.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  Earned on{" "}
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Achievement Stats */}
      <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
              {achievements.length}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-white">
              Total Achievements
            </div>
          </div>
          <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
              {latestAchievement
                ? new Date(latestAchievement.earnedAt).getFullYear()
                : new Date().getFullYear()}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-white">
              Latest Year
            </div>
          </div>
          <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
              {totalPoints}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-white">
              Total Points
            </div>
          </div>
        </div>
      </div>

      {/* Progress motivation */}
      {achievements.length > 0 && achievements.length < 5 && (
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Keep Going! 🚀
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You're building an impressive achievement collection. Complete
              more assignments and engage with peers to unlock even more
              rewards!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;