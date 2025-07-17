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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  // achievementApi,
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
};

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, state, googleLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // ✅ FIXED: Enhanced auto-redirect with better logging (same as Login)
  useEffect(() => {
    console.log("🔍 Auth state changed in Register:", {
      isAuthenticated: state.isAuthenticated,
      user: state.user?.userName,
      isLoading: state.isLoading,
      needsProfileCompletion: state.needsProfileCompletion,
    });

    if (state.isAuthenticated && state.user && !state.isLoading) {
      console.log("✅ Redirecting user after registration...");

      // Add a small delay to ensure state is fully updated
      setTimeout(() => {
        // Check if profile completion is needed
        if (state.needsProfileCompletion) {
          console.log(
            "📋 Profile completion needed, redirecting to complete-profile"
          );
          navigate("/complete-profile", { replace: true });
        } else {
          console.log("🏠 Redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        }
      }, 100);
    }
  }, [
    state.isAuthenticated,
    state.user,
    state.isLoading,
    state.needsProfileCompletion,
    navigate,
  ]);

  // Show loading state while authenticating
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Early redirect if already authenticated (but not during loading)
  if (state?.isAuthenticated && !state.isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof RegisterData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.userName.trim()) {
      return "Full name is required";
    }

    if (!formData.userEmail.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail.trim())) {
      return "Please enter a valid email address";
    }

    if (!formData.userPhoneNumber.trim()) {
      return "Phone number is required";
    }

    if (!formData.userLocation.homeAddress.trim()) {
      return "Home address is required";
    }

    if (!formData.userLocation.currentAddress.trim()) {
      return "Current address is required";
    }

    if (!formData.userRole) {
      return "Please select a role";
    }

    if (formData.userPassword.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (formData.userPassword !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  // ✅ FIXED: Enhanced form submission with better error handling
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, {
        title: "Validation Error",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔍 Submitting registration form...");

      await register(formData);
      console.log("✅ Registration completed successfully");

      // Direct redirect after successful registration
      toast.success("Registration successful! Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);

    } catch (error) {
      console.error("❌ Registration form submission error:", error);

      if (error instanceof AxiosError) {
        const errorData = error.response?.data;

        // Handle specific error cases
        if (error.response?.status === 409) {
          toast.error("An account with this email already exists.", {
            title: "Account Exists",
            action: {
              label: "Login Instead",
              onClick: () => navigate("/login"),
            },
          });
          return;
        }

        if (errorData?.message) {
          toast.error(errorData.message, {
            title: "Registration Error",
          });
          return;
        }

        // Handle validation errors from backend
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          toast.error(`Registration failed: ${errorData.errors.join(", ")}`, {
            title: "Validation Error",
          });
          return;
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
        {
          title: "Registration Error",
        }
      );

  const categories = AchievementApiService.getAchievementCategories(userRole);
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
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
  // Call static methods from the AchievementApiService class

  const canManageAchievements =
    AchievementApiService.canManageAchievements(userRole);
  const canDeleteAchievements =
    AchievementApiService.canDeleteAchievements(userRole);
  userRole;

  // Fetch achievements from backend
  const fetchAchievements = useCallback(async () => {
    if (!state.user) return;

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
      setAchievements(response.achievements);
      setTotalPages(response.pagination.totalPages);

      // Also fetch stats
      const statsResponse = await achievementApi.getAchievementStats();
      setStats(statsResponse);
    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      setError(error.message || "Failed to load achievements");
    } finally {
      setIsLoading(false);
    }
  }, [state.user, currentPage, selectedCategory]);

  // Award achievement
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

      // Refresh achievements list
      await fetchAchievements();
      setShowAwardModal(false);
    } catch (error: any) {
      console.error("Error awarding achievement:", error);
      setError(error.message || "Failed to award achievement");
    } finally {
      setIsAwardingAchievement(false);
    }
  };

  // Delete achievement
  const handleDeleteAchievement = async (achievementId: string) => {
    if (!canDeleteAchievements) return;

    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      await achievementApi.deleteAchievement(achievementId);
      await fetchAchievements(); // Refresh list
    } catch (error: any) {
      console.error("Error deleting achievement:", error);
      setError(error.message || "Failed to delete achievement");
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
      default:
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
      default:
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
        return "from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900";
      case "admin":
        return "from-red-50 to-pink-100 dark:from-red-900 dark:to-pink-900";
      default:
        return "from-yellow-50 to-pink-100 dark:from-yellow-900 dark:to-pink-900";
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

  if (isLoading && achievements.length === 0) {
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
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {AchievementApiService.getAchievementCategories(userRole).map(
              (category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              )
            )}
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
              {stats.overview.totalAchievements}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Total Achievements
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
            <div
              className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
            >
              {stats.overview.totalPoints}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Total Points
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-700">
            <div
              className={`text-2xl sm:text-3xl font-bold mb-2 ${getRoleAccentColor()}`}
            >
              {stats.overview.categories.length}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Categories
            </div>
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-800 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Achievements Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {userRole === "teacher"
              ? "Start creating assignments and engaging with students to earn your first achievements!"
              : userRole === "admin"
              ? "Begin managing the platform and supporting users to unlock achievements!"
              : "Start completing assignments and participating in peer evaluations to earn your first achievements!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {achievements.map((achievement, idx) => {
            const IconComponent =
              iconMap[achievement.icon as keyof typeof iconMap] || Medal;
            return (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-gray-900/50 ease-in-out delay-150 duration-300 relative`}
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
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2 leading-tight">
                      {achievement.title}
                    </h2>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                      {achievement.category}
                    </span>
                  </div>
                  {achievement.points && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        +{achievement.points}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        points
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  {achievement.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Earned on{" "}
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
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

// ============================================================ //

// import React, { useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
// import { useGoogleLogin } from "@react-oauth/google";
// import { useAuth, RegisterData } from "../contexts/AuthContext";
// import { useToast } from "../hooks/useToast";
// import { AxiosError } from "axios";

// enum UserRole {
//   TEACHER = "teacher",
//   STUDENT = "student",
//   ADMIN = "admin",
// }

// const Register: React.FC = () => {
//   const [formData, setFormData] = useState<RegisterData>({
//     userName: "",
//     userEmail: "",
//     userPassword: "",
//     userPhoneNumber: "",
//     countryCode: "+91",
//     userLocation: {
//       homeAddress: "",
//       currentAddress: "",
//     },
//     userRole: "student", // Default role
//   });
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { register, state, googleLogin } = useAuth();
//   const toast = useToast();

//   // Redirect if already authenticated
//   if (state?.isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = event.target;

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...(prev[parent as keyof RegisterData] as any),
//           [child]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = event.target;
//     if (files && files[0]) {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: files[0],
//       }));
//     }
//   };

//   const validateForm = (): string | null => {
//     if (!formData.userName.trim()) {
//       return "Full name is required";
//     }

//     if (!formData.userEmail.trim()) {
//       return "Email is required";
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.userEmail.trim())) {
//       return "Please enter a valid email address";
//     }

//     if (!formData.userPhoneNumber.trim()) {
//       return "Phone number is required";
//     }

//     if (!formData.userLocation.homeAddress.trim()) {
//       return "Home address is required";
//     }

//     if (!formData.userLocation.currentAddress.trim()) {
//       return "Current address is required";
//     }

//     if (!formData.userRole) {
//       return "Please select a role";
//     }

//     if (formData.userPassword.length < 8) {
//       return "Password must be at least 8 characters long";
//     }

//     if (formData.userPassword !== confirmPassword) {
//       return "Passwords do not match";
//     }

//     return null;
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     // Client-side validation
//     const validationError = validateForm();
//     if (validationError) {
//       toast.error(validationError, {
//         title: "Validation Error",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await toast.promise(register(formData), {
//         loading: "Creating your account...",
//         success: (data) => {
//           // Customize success message based on role
//           const roleMessages = {
//             student:
//               "Welcome to the platform! Your student account has been created successfully. 🎓",
//             teacher:
//               "Welcome aboard! Your teacher account has been created successfully. 👨‍🏫",
//             admin:
//               "Admin account created successfully! You now have full access to the platform. 🔑",
//           };
//           return (
//             roleMessages[formData.userRole as keyof typeof roleMessages] ||
//             "Account created successfully! Welcome to the platform! 🎉"
//           );
//         },
//         error: (err) => {
//           if (err instanceof AxiosError) {
//             const errorData = err.response?.data;

//             // Handle specific error cases
//             if (err.response?.status === 409) {
//               return "An account with this email already exists. Please try logging in instead.";
//             }

//             if (errorData?.message) {
//               return errorData.message;
//             }

//             // Handle validation errors from backend
//             if (errorData?.errors && Array.isArray(errorData.errors)) {
//               return `Registration failed: ${errorData.errors.join(", ")}`;
//             }
//           }

//           return err instanceof Error
//             ? err.message
//             : "Registration failed. Please try again.";
//         },
//       });

//       // Success notification with additional action
//       toast.success("You're all set! Redirecting to your dashboard...", {
//         title: "Registration Complete",
//         duration: 3000,
//         action: {
//           label: "Go to Dashboard",
//           onClick: () => (window.location.href = "/dashboard"),
//         },
//       });
//     } catch (error) {
//       // Error is already handled by toast.promise, but we can log for debugging
//       console.error("Registration error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Google Login using @react-oauth/google (for registration)
//   const handleGoogleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       setIsLoading(true);
//       try {
//         // Get user info from Google using the access token
//         const userInfoResponse = await fetch(
//           `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
//         );
//         const userInfo = await userInfoResponse.json();

//         // Create a credential-like object to send to backend
//         const credential = btoa(
//           JSON.stringify({
//             sub: userInfo.id,
//             email: userInfo.email,
//             name: userInfo.name,
//             picture: userInfo.picture,
//             email_verified: userInfo.verified_email,
//           })
//         );

//         await toast.promise(googleLogin(credential), {
//           loading: "Signing up with Google...",
//           success: "Google authentication successful!",
//           error: (err) => `Google authentication failed: ${err.message}`,
//         });

//         // Redirect to dashboard or profile completion if needed
//         window.location.href = "/dashboard";
//       } catch (error: any) {
//         console.error("Google signup error:", error);
//         toast.error(`Google signup failed: ${error.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     onError: (error) => {
//       console.error("Google signup error:", error);
//       toast.error("Google signup failed. Please try again.");
//       setIsLoading(false);
//     },
//   });

//   const handleSocialAuth = (provider: string) => {
//     if (provider.toLowerCase() === "google") {
//       handleGoogleLogin();
//     } else {
//       // GitHub authentication - placeholder for now
//       toast.info("GitHub authentication will be available soon!", {
//         title: "Coming Soon",
//         duration: 3000,
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4 py-8">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-2xl w-full space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Create an Account
//           </h2>
//           <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//             Join our platform and start your learning journey
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-2">
//             <input
//               type="text"
//               name="userName"
//               placeholder="Full Name"
//               value={formData.userName}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//             <input
//               type="email"
//               name="userEmail"
//               placeholder="Email"
//               value={formData.userEmail}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <select
//               name="countryCode"
//               value={formData.countryCode}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             >
//               <option value="+1">+1 (US)</option>
//               <option value="+91">+91 (IN)</option>
//               <option value="+44">+44 (UK)</option>
//               <option value="+33">+33 (FR)</option>
//               <option value="+49">+49 (DE)</option>
//             </select>
//             <input
//               type="tel"
//               name="userPhoneNumber"
//               placeholder="Phone Number"
//               value={formData.userPhoneNumber}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="md:col-span-2 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//           </div>

//           <input
//             type="text"
//             name="userLocation.homeAddress"
//             placeholder="Home Address"
//             value={formData.userLocation.homeAddress}
//             onChange={handleInputChange}
//             required
//             disabled={isLoading}
//             className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//           />

//           <input
//             type="text"
//             name="userLocation.currentAddress"
//             placeholder="Current Address"
//             value={formData.userLocation.currentAddress}
//             onChange={handleInputChange}
//             required
//             disabled={isLoading}
//             className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="password"
//               name="userPassword"
//               placeholder="Password (min 8 characters)"
//               value={formData.userPassword}
//               onChange={handleInputChange}
//               required
//               minLength={8}
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(event) => setConfirmPassword(event.target.value)}
//               required
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//           </div>

//           {/* Role Selection */}
//           <div className="space-y-3">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Select Your Role <span className="text-red-500">*</span>
//             </label>
//             <div className="flex gap-6">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="userRole"
//                   value={UserRole.STUDENT}
//                   checked={formData.userRole === UserRole.STUDENT}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   className="text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300">
//                   Student
//                 </span>
//               </label>

//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="userRole"
//                   value={UserRole.TEACHER}
//                   checked={formData.userRole === UserRole.TEACHER}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   className="text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300">
//                   Teacher
//                 </span>
//               </label>

//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="userRole"
//                   value={UserRole.ADMIN}
//                   checked={formData.userRole === UserRole.ADMIN}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   className="text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300">Admin</span>
//               </label>
//             </div>
//           </div>

//           {/* Optional file uploads */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Profile Picture (optional)
//               </label>
//               <input
//                 type="file"
//                 name="avatar"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//                 className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Cover Image (optional)
//               </label>
//               <input
//                 type="file"
//                 name="coverImage"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//                 className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center space-x-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span>Creating Account...</span>
//               </>
//             ) : (
//               <span>Create Account</span>
//             )}
//           </button>
//         </form>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300 dark:border-gray-600" />
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
//               Or continue with
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-col gap-3">
//           <button
//             type="button"
//             disabled={isLoading}
//             onClick={() => handleSocialAuth("google")}
//             className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 py-3 rounded-lg shadow-sm hover:shadow-md transition disabled:opacity-50"
//           >
//             <FcGoogle size={20} />
//             <span className="text-gray-800 dark:text-gray-200">
//               Sign up with Google
//             </span>
//           </button>
//           <button
//             type="button"
//             disabled={isLoading}
//             onClick={() => handleSocialAuth("github")}
//             className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-lg shadow-sm hover:bg-gray-800 transition disabled:opacity-50"
//           >
//             <FaGithub size={20} />
//             <span>Sign up with GitHub</span>
//           </button>
//         </div>

//         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-indigo-600 hover:underline font-medium"
//           >
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
