// // Achievements.tsx

// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import {
//   ScrollText,
//   Medal,
//   Globe,
//   Loader2,
//   Trophy,
//   Award,
//   Star,
//   Users,
//   BookOpen,
//   Shield,
//   Target,
//   BarChart3,
//   Plus,
//   Edit,
//   Trash2,
//   Crown,
//   Zap,
//   Heart,
// } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   // achievementApi,
//   Achievement,
//   AchievementsResponse,
//   AchievementStats,
//   CreateAchievementData,
// } from "../services/achievements.api";
// import achievementApi from "../services/achievements.api";
// import {AchievementApiService} from "../services/achievements.api";

// const iconMap = {
//   Medal,
//   ScrollText,
//   Globe,
//   Trophy,
//   Award,
//   Star,
//   Users,
//   BookOpen,
//   Shield,
//   Target,
//   BarChart3,
//   Crown,
//   Zap,
//   Heart,
// };

// interface AchievementModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateAchievementData) => void;
//   userRole: string;
//   isLoading: boolean;
// }

// const AchievementModal: React.FC<AchievementModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   userRole,
//   isLoading,
// }) => {
//   const [formData, setFormData] = useState<CreateAchievementData>({
//     title: "",
//     description: "",
//     type: "",
//     category: "academic",
//     icon: "Medal",
//     points: 10,
//     userId: "",
//   });

//   const categories = AchievementApiService.getAchievementCategories(userRole);
//   const icons = Object.keys(iconMap);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//             Award Achievement
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {userRole === "teacher" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Student ID (required for teachers)
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.userId || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, userId: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//                   required={userRole === "teacher"}
//                 />
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//                 rows={3}
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Category
//                 </label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) =>
//                     setFormData({ ...formData, category: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Icon
//                 </label>
//                 <select
//                   value={formData.icon}
//                   onChange={(e) =>
//                     setFormData({ ...formData, icon: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   {icons.map((icon) => (
//                     <option key={icon} value={icon}>
//                       {icon}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Type
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.type}
//                   onChange={(e) =>
//                     setFormData({ ...formData, type: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//                   placeholder="e.g., first_assignment"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Points
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.points}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       points: parseInt(e.target.value),
//                     })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//                   min="1"
//                   max="100"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
//               >
//                 {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//                 <span>Award Achievement</span>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Achievements: React.FC = () => {
//   const { state } = useAuth();
//   const [achievements, setAchievements] = useState<Achievement[]>([]);
//   const [stats, setStats] = useState<AchievementStats | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAwardingAchievement, setIsAwardingAchievement] = useState(false);
//   const [showAwardModal, setShowAwardModal] = useState(false);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");

//   const userRole = state.user?.userRole || "student";

//   // Call static methods from the AchievementApiService class
//   const canManageAchievements = AchievementApiService.canManageAchievements(userRole);
//   const canDeleteAchievements = 
//     AchievementApiService.canDeleteAchievements(userRole);

//   // Fetch achievements from backend
//   const fetchAchievements = useCallback(async () => {
//     if (!state.user) return;

//     try {
//       setIsLoading(true);
//       setError("");

//       const params = {
//         page: currentPage,
//         limit: 12,
//         ...(selectedCategory && { category: selectedCategory }),
//       };

//       const response: AchievementsResponse =
//         await achievementApi.getUserAchievements(params);
//       setAchievements(response.achievements);
//       setTotalPages(response.pagination.totalPages);

//       // Also fetch stats
//       const statsResponse = await achievementApi.getAchievementStats();
//       setStats(statsResponse);
//     } catch (error: any) {
//       console.error("Error fetching achievements:", error);
//       setError(error.message || "Failed to load achievements");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [state.user, currentPage, selectedCategory]);

//   // Award achievement (from Teacher to Student)
//   const handleAwardAchievement = async (data: CreateAchievementData) => {
//     try {
//       setIsAwardingAchievement(true);

//       let newAchievement: Achievement;

//       if (userRole === "teacher") {
//         newAchievement = await achievementApi.teacherAwardAchievement(
//           data as CreateAchievementData & { userId: string }
//         );
//       } else if (userRole === "admin") {
//         newAchievement = await achievementApi.adminAwardAchievement(data);
//       } else {
//         newAchievement = await achievementApi.createAchievement(data);
//       }

//       console.log("New achievement:", newAchievement);

//       // Refresh achievements list
//       await fetchAchievements();
//       setShowAwardModal(false);
//     } catch (error: any) {
//       console.error("Error awarding achievement:", error);
//       setError(error.message || "Failed to award achievement");
//     } finally {
//       setIsAwardingAchievement(false);
//     }
//   };

//   // Delete achievement
//   const handleDeleteAchievement = async (achievementId: string) => {
//     if (!canDeleteAchievements) return;

//     if (!confirm("Are you sure you want to delete this achievement?")) return;

//     try {
//       await achievementApi.deleteAchievement(achievementId);
//       await fetchAchievements(); // Refresh list
//     } catch (error: any) {
//       console.error("Error deleting achievement:", error);
//       setError(error.message || "Failed to delete achievement");
//     }
//   };

//   useEffect(() => {
//     fetchAchievements();
//   }, [fetchAchievements]);

//   const getRarityColor = (rarity?: string) => {
//     switch (rarity) {
//       case "legendary":
//         return "from-yellow-500 to-orange-600";
//       case "epic":
//         return "from-purple-500 to-purple-600";
//       case "rare":
//         return "from-blue-500 to-blue-600";
//       default:
//         return "from-gray-500 to-gray-600";
//     }
//   };

//   const getRarityBorder = (rarity?: string) => {
//     switch (rarity) {
//       case "legendary":
//         return "border-yellow-400 dark:border-yellow-500";
//       case "epic":
//         return "border-purple-400 dark:border-purple-500";
//       case "rare":
//         return "border-blue-400 dark:border-blue-500";
//       default:
//         return "border-gray-300 dark:border-gray-600";
//     }
//   };

//   const getRoleSpecificTitle = () => {
//     switch (userRole) {
//       case "teacher":
//         return "🎓 Teaching Achievements";
//       case "admin":
//         return "🛡️ Administrative Achievements";
//       default:
//         return "🏆 Academic Achievements";
//     }
//   };

//   const getRoleSpecificDescription = () => {
//     switch (userRole) {
//       case "teacher":
//         return "Your teaching milestones, student engagement, and educational excellence";
//       case "admin":
//         return "System management, platform growth, and administrative excellence";
//       default:
//         return "Your learning journey, peer contributions, and academic milestones";
//     }
//   };

//   const getRoleGradient = () => {
//     switch (userRole) {
//       case "teacher":
//         // Adjusted dark mode gradient to a subtle gray-black with a border
//         return "from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black border dark:border-gray-700";
//       case "admin":
//         // Adjusted dark mode gradient to a subtle gray-black with a border
//         return "from-red-50 to-pink-100 dark:from-gray-900 dark:to-black border dark:border-gray-700";
//       default:
//         // Adjusted dark mode gradient to a subtle gray-black with a border
//         return "from-yellow-50 to-pink-100 dark:from-gray-900 dark:to-black border dark:border-gray-700";
//     }
//   };

//   const getRoleAccentColor = () => {
//     switch (userRole) {
//       case "teacher":
//         return "text-blue-700 dark:text-blue-300";
//       case "admin":
//         return "text-red-700 dark:text-red-300";
//       default:
//         return "text-pink-700 dark:text-amber-600";
//     }
//   };

//   if (isLoading && achievements.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
//           <p className="text-gray-600 dark:text-gray-400">
//             Loading achievements...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`p-4 sm:p-6 lg:p-8 bg-gradient-to-br ${getRoleGradient()} min-h-screen rounded-xl`}
//     >
//       {/* Header */}
//       <div className="mb-6 sm:mb-8 lg:mb-10">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1
//               className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getRoleAccentColor()}`}
//             >
//               {getRoleSpecificTitle()}
//             </h1>
//             <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
//               {getRoleSpecificDescription()}
//             </p>
//           </div>

//           {canManageAchievements && (
//             <button
//               onClick={() => setShowAwardModal(true)}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//             >
//               <Plus className="w-4 h-4" />
//               <span>Award Achievement</span>
//             </button>
//           )}
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 items-center">
//           <select
//             value={selectedCategory}
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
//           >
//             <option value="">All Categories</option>
//             {AchievementApiService
//               .getAchievementCategories(userRole)
//               .map((category) => (
//                 <option key={category} value={category}>
//                   {category.charAt(0).toUpperCase() + category.slice(1)}
//                 </option>
//               ))}
//           </select>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
//           <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
//         </div>
//       )}

//       {/* Achievement Stats */}
//       {stats && (
//         <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
//             <div
//               className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
//             >
//               {stats.overview.totalAchievements}
//             </div>
//             <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//               Total Achievements
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
//             <div
//               className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
//             >
//               {stats.overview.totalPoints}
//             </div>
//             <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//               Total Points
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
//             <div
//               className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
//             >
//               {stats.overview.categories.length}
//             </div>
//             <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//               Categories
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Achievements Grid */}
//       {achievements.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-800 rounded-full flex items-center justify-center mb-6">
//             <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-300" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//             No Achievements Yet
//           </h3>
//           <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
//             {userRole === "teacher"
//               ? "Start creating assignments and engaging with students to earn your first achievements!"
//               : userRole === "admin"
//               ? "Begin managing the platform and supporting users to unlock achievements!"
//               : "Start completing assignments and participating in peer evaluations to earn your first achievements!"}
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
//           {achievements.map((achievement, idx) => {
//             const IconComponent =
//               iconMap[achievement.icon as keyof typeof iconMap] || Medal;
//             return (
//               <motion.div
//                 key={achievement._id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: idx * 0.1 }}
//                 // Adjusted dark mode background and border for individual achievement cards
//                 className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border-2 border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-gray-700/50 ease-in-out delay-150 duration-300 relative`}
//               >
//                 {canDeleteAchievements && (
//                   <button
//                     onClick={() => handleDeleteAchievement(achievement._id)}
//                     className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 )}

//                 <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
//                   <div
//                     // Adjusted dark mode icon background for better contrast
//                     className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center`}
//                   >
//                     <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2 leading-tight">
//                       {achievement.title}
//                     </h2>
//                     <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-indigo-100 dark:bg-gray-700/50 text-indigo-800 dark:text-gray-300">
//                       {achievement.category}
//                     </span>
//                   </div>
//                   {achievement.points && (
//                     <div className="flex-shrink-0 text-right">
//                       <div className="text-lg font-bold text-indigo-600 dark:text-gray-300">
//                         +{achievement.points}
//                       </div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         points
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
//                   {achievement.description}
//                 </p>
//                 <div className="text-xs text-gray-500 dark:text-gray-500">
//                   Earned on{" "}
//                   {new Date(achievement.earnedAt).toLocaleDateString()}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="mt-8 flex justify-center">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               // Adjusted dark mode background and border for pagination buttons
//               className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
//             >
//               Previous
//             </button>
//             <span className="px-3 py-2 bg-indigo-600 text-white rounded-lg">
//               {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               // Adjusted dark mode background and border for pagination buttons
//               className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Functionality for Teachers only*/}
//       {userRole === "teacher" && (
//         <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
//           <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
//             📊 Class Overview
//           </h3>
//           {/* Teachers can select a particular course from the course list and then see its stats*/}
//         </div>
//       )}
//       {/* Award Achievement Modal */}
//       <AchievementModal
//         isOpen={showAwardModal}
//         onClose={() => setShowAwardModal(false)}
//         onSubmit={handleAwardAchievement}
//         userRole={userRole}
//         isLoading={isAwardingAchievement}
//       />
//     </div>
//   );
// };

// export default Achievements;
// Achievements.tsx

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ScrollText,
  Medal,
  Globe,
  Loader2,
  Trophy,
  Award,
  Star,
  Users,
  BookOpen,
  Shield,
  Target,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Crown,
  Zap,
  Heart,
  Lightbulb, // New icon for a fake achievement
  Flag,      // Another new icon for a fake achievement
  // Add any other icons you might want to use for initial dummy data
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Achievement,
  AchievementsResponse,
  AchievementStats,
  CreateAchievementData,
} from "../services/achievements.api";
import achievementApi from "../services/achievements.api";
import { AchievementApiService } from "../services/achievements.api";

const iconMap = {
  Medal,
  ScrollText,
  Globe,
  Trophy,
  Award,
  Star,
  Users,
  BookOpen,
  Shield,
  Target,
  BarChart3,
  Crown,
  Zap,
  Heart,
  Lightbulb,
  Flag,
};

// --- Initial Dummy Achievement Data (for "No Achievements Yet" state) ---
const initialDummyAchievements: Achievement[] = [
  {
    _id: "dummy_init_1",
    title: "Welcome Explorer!",
    description: "You've successfully landed on the achievements page. Discover your potential!",
    type: "onboarding",
    category: "system",
    icon: "Globe",
    points: 5,
    earnedAt: new Date().toISOString(),
    userId: "dummy_user",
    rarity: "common",
  },
  {
    _id: "dummy_init_2",
    title: "First Step Forward",
    description: "A placeholder for your very first achievement. Keep going!",
    type: "progress",
    category: "growth",
    icon: "ScrollText",
    points: 10,
    earnedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userId: "dummy_user",
    rarity: "common",
  },
  {
    _id: "dummy_init_3",
    title: "Community Builder",
    description: "Engage with peers and build connections.",
    type: "social",
    category: "community",
    icon: "Users",
    points: 15,
    earnedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    userId: "dummy_user",
    rarity: "rare",
  },
  {
    _id: "dummy_init_4",
    title: "Thinker's Insight",
    description: "Contribute an insightful idea or question.",
    type: "contribution",
    category: "innovation",
    icon: "Lightbulb",
    points: 20,
    earnedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    userId: "dummy_user",
    rarity: "epic",
  },
];


// --- FAKE ACHIEVEMENT DATA (for merging with API data) ---
// This data will be merged with real API data and then filtered.
// It's separate from initialDummyAchievements to allow showing something
// even if API returns nothing, and then still incorporating these
// when API data *is* present.
const extendedFakeAchievementsData: Achievement[] = [
  {
    _id: "fake_id_1",
    title: "Community Champion",
    description: "Actively participated in forum discussions and helped peers consistently.",
    type: "participation",
    category: "community",
    icon: "Users",
    points: 25,
    earnedAt: new Date('2024-06-15T10:00:00Z').toISOString(),
    userId: "fake_user_id_123",
    rarity: "rare",
  },
  {
    _id: "fake_id_2",
    title: "Innovation Architect",
    description: "Proposed and developed a creative solution during a project sprint.",
    type: "creativity",
    category: "innovation",
    icon: "Lightbulb",
    points: 50,
    earnedAt: new Date('2024-05-20T14:30:00Z').toISOString(),
    userId: "fake_user_id_123",
    rarity: "epic",
  },
  {
    _id: "fake_id_3",
    title: "Ahead of Schedule",
    description: "Completed all assignments a week before the deadline for an entire semester.",
    type: "punctuality",
    category: "academic",
    icon: "Flag",
    points: 10,
    earnedAt: new Date('2024-07-01T09:00:00Z').toISOString(),
    userId: "fake_user_id_123",
    rarity: "common",
  },
  {
    _id: "fake_id_4",
    title: "Grand Debater",
    description: "Achieved first place in the inter-school debate competition.",
    type: "competition",
    category: "extracurricular",
    icon: "Shield",
    points: 75,
    earnedAt: new Date('2024-04-10T11:00:00Z').toISOString(),
    userId: "fake_user_id_123",
    rarity: "legendary",
  },
  {
    _id: "fake_id_5",
    title: "Code Ninja",
    description: "Successfully debugged a complex module under pressure.",
    type: "technical",
    category: "programming", // New category for this fake achievement
    icon: "Target",
    points: 40,
    earnedAt: new Date('2024-03-22T16:00:00Z').toISOString(),
    userId: "fake_user_id_123",
    rarity: "rare",
  },
  {
    _id: "fake_id_6",
    title: "Presentation Master",
    description: "Delivered an outstanding presentation that received high praise.",
    type: "presentation",
    category: "communication", // New category
    icon: "BarChart3",
    points: 30,
    earnedAt: new Date('2024-02-18T10:00:00Z').toISOString(),
    userId: "fake_user_id_123",
    rarity: "common",
  },
];


interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAchievementData) => void;
  userRole: string;
  isLoading: boolean;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userRole,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateAchievementData>({
    title: "",
    description: "",
    type: "",
    category: "academic",
    icon: "Medal",
    points: 10,
    userId: "",
  });

  // Dynamically get all unique categories including fake ones for the modal
  const allCategoriesForModal = Array.from(new Set([
    ...AchievementApiService.getAchievementCategories(userRole),
    ...extendedFakeAchievementsData.map(fa => fa.category),
    ...initialDummyAchievements.map(ida => ida.category) // Include initial dummy categories
  ]));

  const icons = Object.keys(iconMap);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Award Achievement
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {userRole === "teacher" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student ID (required for teachers)
                </label>
                <input
                  type="text"
                  value={formData.userId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required={userRole === "teacher"}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {allCategoriesForModal.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {icons.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., first_assignment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Award Achievement</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Achievements: React.FC = () => {
  const { state } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAwardingAchievement, setIsAwardingAchievement] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const userRole = state.user?.userRole || "student";

  const canManageAchievements = AchievementApiService.canManageAchievements(userRole);
  const canDeleteAchievements = AchievementApiService.canDeleteAchievements(userRole);

  const fetchAchievements = useCallback(async () => {
    if (!state.user) {
      // If no user, just show dummy achievements
      const filteredDummy = selectedCategory
        ? initialDummyAchievements.filter(ach => ach.category === selectedCategory)
        : initialDummyAchievements;
      setAchievements(filteredDummy);
      setTotalPages(1); // Only one page for dummy data
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const params = {
        page: currentPage,
        limit: 12,
        ...(selectedCategory && { category: selectedCategory }),
      };

      const response: AchievementsResponse =
        await achievementApi.getUserAchievements(params);

      // --- CRUCIAL CHANGE HERE ---
      // Decide which set of achievements to use:
      // If API returns no achievements AND no category is selected,
      // use the initialDummyAchievements.
      // Otherwise, merge extendedFakeAchievementsData with API results.
      let allAchievementsCombined: Achievement[];

      if (response.achievements.length === 0 && !selectedCategory) {
        allAchievementsCombined = initialDummyAchievements;
      } else {
        // Filter extendedFakeAchievementsData if a category is selected
        const categoryFilteredFake = selectedCategory
          ? extendedFakeAchievementsData.filter(ach => ach.category === selectedCategory)
          : extendedFakeAchievementsData;

        allAchievementsCombined = [...categoryFilteredFake, ...response.achievements];
      }

      // Apply selected category filter to the combined list (if any)
      const finalFilteredAchievements = selectedCategory
        ? allAchievementsCombined.filter(ach => ach.category === selectedCategory)
        : allAchievementsCombined;


      setAchievements(finalFilteredAchievements);
      // For simplicity, totalPages is still largely driven by real API,
      // or set to 1 if only dummy data is shown.
      setTotalPages(response.pagination.totalPages || 1); // Ensure totalPages is at least 1

      const statsResponse = await achievementApi.getAchievementStats();
      // Adjust stats to include extended fake data only if actual achievements are present
      // or if initialDummyAchievements is not primarily shown
      const totalAchievementsCount = statsResponse.overview.totalAchievements +
                                     (response.achievements.length > 0 ? extendedFakeAchievementsData.length : 0);
      const totalPointsCount = statsResponse.overview.totalPoints +
                               (response.achievements.length > 0 ? extendedFakeAchievementsData.reduce((sum, ach) => sum + ach.points, 0) : 0);

      setStats({
          overview: {
              ...statsResponse.overview,
              totalAchievements: totalAchievementsCount,
              totalPoints: totalPointsCount,
          },
          // Categories will be dynamically calculated for filter dropdown
      });

    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      setError(error.message || "Failed to load achievements");
      // Fallback to initial dummy data on API error
      setAchievements(initialDummyAchievements);
      setTotalPages(1);
      setStats({
          overview: {
              totalAchievements: initialDummyAchievements.length,
              totalPoints: initialDummyAchievements.reduce((sum, ach) => sum + ach.points, 0),
              categories: Array.from(new Set(initialDummyAchievements.map(a => a.category))),
              topCategories: []
          }
      });
    } finally {
      setIsLoading(false);
    }
  }, [state.user, currentPage, selectedCategory]);

  const handleAwardAchievement = async (data: CreateAchievementData) => {
    try {
      setIsAwardingAchievement(true);
      let newAchievement: Achievement;

      if (userRole === "teacher") {
        newAchievement = await achievementApi.teacherAwardAchievement(
          data as CreateAchievementData & { userId: string }
        );
      } else if (userRole === "admin") {
        newAchievement = await achievementApi.adminAwardAchievement(data);
      } else {
        newAchievement = await achievementApi.createAchievement(data);
      }

      console.log("New achievement:", newAchievement);
      await fetchAchievements();
      setShowAwardModal(false);
    } catch (error: any) {
      console.error("Error awarding achievement:", error);
      setError(error.message || "Failed to award achievement");
    } finally {
      setIsAwardingAchievement(false);
    }
  };

  const handleDeleteAchievement = async (achievementId: string) => {
    if (!canDeleteAchievements) return;

    // Check if it's a fake achievement (from either dummy set or extended set)
    const isInitialDummy = initialDummyAchievements.some(dummy => dummy._id === achievementId);
    const isExtendedFake = extendedFakeAchievementsData.some(fake => fake._id === achievementId);

    if (isInitialDummy || isExtendedFake) {
      if (!confirm("Are you sure you want to delete this dummy achievement?")) return;
      setAchievements(prev => prev.filter(ach => ach._id !== achievementId));
      console.log("Dummy achievement deleted locally:", achievementId);
      // No API call for dummy data
    } else {
      // For real achievements, proceed with API call
      if (!confirm("Are you sure you want to delete this achievement?")) return;
      try {
        await achievementApi.deleteAchievement(achievementId);
        await fetchAchievements(); // Refresh list after deletion
      } catch (error: any) {
        console.error("Error deleting achievement:", error);
        setError(error.message || "Failed to delete achievement");
      }
    }
  };


  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-500 to-orange-600";
      case "epic":
        return "from-purple-500 to-purple-600";
      case "rare":
        return "from-blue-500 to-blue-600";
      default: // Common or undefined
        return "from-gray-500 to-gray-600";
    }
  };

  const getRarityBorder = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-400 dark:border-yellow-500";
      case "epic":
        return "border-purple-400 dark:border-purple-500";
      case "rare":
        return "border-blue-400 dark:border-blue-500";
      default: // Common or undefined
        return "border-gray-300 dark:border-gray-600";
    }
  };

  const getRoleSpecificTitle = () => {
    switch (userRole) {
      case "teacher":
        return "🎓 Teaching Achievements";
      case "admin":
        return "🛡️ Administrative Achievements";
      default:
        return "🏆 Academic Achievements";
    }
  };

  const getRoleSpecificDescription = () => {
    switch (userRole) {
      case "teacher":
        return "Your teaching milestones, student engagement, and educational excellence";
      case "admin":
        return "System management, platform growth, and administrative excellence";
      default:
        return "Your learning journey, peer contributions, and academic milestones";
    }
  };

  const getRoleGradient = () => {
    switch (userRole) {
      case "teacher":
        return "from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black border dark:border-gray-700";
      case "admin":
        return "from-red-50 to-pink-100 dark:from-gray-900 dark:to-black border dark:border-gray-700";
      default:
        return "from-yellow-50 to-pink-100 dark:from-gray-900 dark:to-black border dark:border-gray-700";
    }
  };

  const getRoleAccentColor = () => {
    switch (userRole) {
      case "teacher":
        return "text-blue-700 dark:text-blue-300";
      case "admin":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-pink-700 dark:text-amber-600";
    }
  };

  // Get all available categories for filtering, combining real, extended fake, and initial dummy ones
  const allFilterCategories = Array.from(new Set([
    ...AchievementApiService.getAchievementCategories(userRole),
    ...extendedFakeAchievementsData.map(fa => fa.category),
    ...initialDummyAchievements.map(ida => ida.category)
  ]));

  // Decide which list to render: achievements (real + extended fake) or initialDummyAchievements
  const achievementsToRender = achievements.length > 0 ? achievements : initialDummyAchievements;


  if (isLoading && achievements.length === 0) { // Keep loading spinner if nothing is loaded yet
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

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 bg-gradient-to-br ${getRoleGradient()} min-h-screen rounded-xl`}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getRoleAccentColor()}`}
            >
              {getRoleSpecificTitle()}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
              {getRoleSpecificDescription()}
            </p>
          </div>

          {canManageAchievements && (
            <button
              onClick={() => setShowAwardModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Award Achievement</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset to first page on category change
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {allFilterCategories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Achievement Stats */}
      {stats && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
            <div
              className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
            >
              {stats.overview.totalAchievements + extendedFakeAchievementsData.length + initialDummyAchievements.length} {/* Adjust total count for all dummies */}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Total Achievements
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
            <div
              className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
            >
              {stats.overview.totalPoints + extendedFakeAchievementsData.reduce((sum, ach) => sum + ach.points, 0) + initialDummyAchievements.reduce((sum, ach) => sum + ach.points, 0)} {/* Adjust total points for all dummies */}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Total Points
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
            <div
              className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
            >
              {allFilterCategories.length} {/* Adjust category count */}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Categories
            </div>
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      {/* RENDER achievementsToRender INSTEAD OF direct 'achievements' */}
      {achievementsToRender.length === 0 && !isLoading ? ( // Only show "No achievements" if genuinely empty AND not loading
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-800 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Achievements Found in This Category
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Try selecting "All Categories" or checking back later for new milestones!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {achievementsToRender.map((achievement, idx) => { // Use achievementsToRender here
            const IconComponent =
              iconMap[achievement.icon as keyof typeof iconMap] || Medal;
            return (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border-2 border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-gray-700/50 ease-in-out delay-150 duration-300 relative ${getRarityBorder(achievement.rarity)}`}
              >
                {canDeleteAchievements && (
                  <button
                    onClick={() => handleDeleteAchievement(achievement._id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-xl flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2 leading-tight">
                      {achievement.title}
                    </h2>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-indigo-100 dark:bg-gray-700/50 text-indigo-800 dark:text-gray-300">
                      {achievement.category}
                    </span>
                  </div>
                  {achievement.points && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-indigo-600 dark:text-gray-300">
                        +{achievement.points}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        points
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  {achievement.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Earned on{" "}
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && ( // Only show pagination if there are actual multiple pages
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            <span className="px-3 py-2 bg-indigo-600 text-white rounded-lg">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Functionality for Teachers only*/}
      {userRole === "teacher" && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            📊 Class Overview
          </h3>
          {/* Teachers can select a particular course from the course list and then see its stats*/}
        </div>
      )}
      {/* Award Achievement Modal */}
      <AchievementModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        onSubmit={handleAwardAchievement}
        userRole={userRole}
        isLoading={isAwardingAchievement}
      />
    </div>
  );
};

export default Achievements;