// ========================== //

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Camera,
  Edit3,
  Save,
  X,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Code,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useStreak } from "../contexts/StreakContext";
import { apiService } from "../services/api";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { state: authState, updateProfile } = useAuth();
  const { streakData } = useStreak();

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === authState.user?._id;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Real user data from auth context or fetched user data
  const [userData, setUserData] = useState(authState.user);
  const [tempData, setTempData] = useState(userData);
  const [newSkill, setNewSkill] = useState("");

  // Fetch user data if viewing another user's profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOwnProfile && userId) {
        setIsLoading(true);
        try {
          const response = await apiService.get(`/user/profile/${userId}`);
          const res = response as { data: any };
          setUserData(res.data);
          setTempData(res.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user profile");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [userId, isOwnProfile]);

  // Update local data when auth user changes
  useEffect(() => {
    if (isOwnProfile && authState.user) {
      setUserData(authState.user);
      setTempData(authState.user);
    }
  }, [authState.user, isOwnProfile]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userData);
  };

  const handleSave = async () => {
    if (!isOwnProfile || !tempData) return;

    setIsLoading(true);
    setError("");

    try {
      await updateProfile(tempData);
      setUserData(tempData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
    setNewSkill("");
    setError("");
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: string
  ) => {
    setTempData((prev) => {
      if (!prev) return null;
      // Only handle known nested objects, e.g., userLocation
      if (parent === "userLocation") {
        return {
          ...prev,
          userLocation: {
            homeAddress: prev.userLocation?.homeAddress ?? "",
            currentAddress: prev.userLocation?.currentAddress ?? "",
            [field]: value,
          },
        };
      }
      // fallback: return prev unchanged if parent is not handled
      return prev;
    });
  };

  // Add this utility to safely get an array from userSkills:
  const getSkillsArray = (skills: any) => {
    if (Array.isArray(skills)) return skills;
    // If it's an object, get its values as an array
    if (skills && typeof skills === "object") return Object.values(skills);
    return [];
  };
  const handleAddSkill = () => {
    if (
      newSkill.trim() &&
      !(
        Array.isArray(tempData?.userSkills) &&
        tempData.userSkills.some(
          (skill: { name: string }) => skill.name === newSkill.trim()
        )
      )
    ) {
      setTempData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          userSkills: [
            ...(prev.userSkills || []),
            {
              name: newSkill.trim(),
              level: "Beginner",
              category: "General",
              verified: false,
            },
          ],
        };
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTempData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        userSkills:
          prev.userSkills?.filter(
            (skill: { name: string }) => skill.name !== skillToRemove
          ) || [],
      };
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  // Mock stats - in production, these would come from the backend
  const stats = [
    {
      label: "Assignments Completed",
      value: "47",
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Peer Evaluations",
      value: "156",
      icon: User,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Average Rating",
      value: "4.8",
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Current Streak",
      value: `${streakData.currentStreak} day${streakData.currentStreak !== 1 ? 's' : ''}`,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  if (isLoading && !userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
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

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">User not found</p>
      </div>
    );
  }

  const displayData = isEditing ? tempData : userData;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
            {isOwnProfile ? "My Profile" : `${userData.userName}'s Profile`}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
            {isOwnProfile
              ? "Manage your personal information and academic details"
              : "View user profile and information"}
          </p>
        </div>

        {isOwnProfile && !isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 w-full sm:w-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : isOwnProfile && isEditing ? (
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200 w-full sm:w-auto"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl transition-colors duration-200 w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isLoading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        ) : null}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Card */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {displayData?.userProfileImage ? (
                  <img
                    src={displayData?.userProfileImage}
                    alt={displayData?.userName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                    {displayData?.userName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </div>
                )}
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                {displayData?.userName || "Unknown User"}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                {displayData?.userAcademicInformation?.major || "Student"} •{" "}
                {displayData?.userRole || "Member"}
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{displayData?.userEmail}</span>
                </div>
                {displayData?.userLocation?.currentAddress && (
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {displayData?.userLocation.currentAddress
                        .split(",")[1]
                        ?.trim() || "Location"}
                    </span>
                  </div>
                )}
                {displayData?.userJoiningDate && (
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      Joined{" "}
                      {new Date(
                        displayData?.userJoiningDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {displayData?.userSocialMediaProfiles &&
              displayData?.userSocialMediaProfiles.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-center space-x-3 sm:space-x-4">
                    {displayData?.userSocialMediaProfiles.map(
                      (social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          {social.platform.toLowerCase().includes("github") ? (
                            <Github className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                          ) : social.platform
                              .toLowerCase()
                              .includes("linkedin") ? (
                            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <stat.icon
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`}
                  />
                </div>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Details */}
        <div className="xl:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData?.userName || ""}
                    onChange={(e) =>
                      handleInputChange("userName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userName || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempData?.userEmail || ""}
                    onChange={(e) =>
                      handleInputChange("userEmail", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userEmail || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={`${tempData?.countryCode || ""} ${
                      tempData?.userPhoneNumber || ""
                    }`}
                    onChange={(e) => {
                      const value = e.target.value;
                      const parts = value.split(" ");
                      handleInputChange("countryCode", parts[0] || "");
                      handleInputChange(
                        "userPhoneNumber",
                        parts.slice(1).join(" ") || ""
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.countryCode && displayData?.userPhoneNumber
                      ? `${displayData?.countryCode} ${displayData?.userPhoneNumber}`
                      : "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Home Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData?.userLocation?.homeAddress || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "userLocation",
                        "homeAddress",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userLocation?.homeAddress || "Not provided"}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData?.userLocation?.currentAddress || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "userLocation",
                        "currentAddress",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userLocation?.currentAddress ||
                      "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={tempData?.userBio || ""}
                  onChange={(e) => handleInputChange("userBio", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                  {displayData?.userBio || "No bio available"}
                </p>
              )}
            </div>
          </div>

          {/* Academic Information */}
          {displayData?.userAcademicInformation && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Academic Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    University
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userAcademicInformation.institution ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Major
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userAcademicInformation.major ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grade/GPA
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userAcademicInformation.gpa ?? "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userAcademicInformation.degree ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Graduation Year
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {displayData?.userAcademicInformation.graduationYear ??
                      "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skills Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Skills
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Technical and professional skills
                </p>
              </div>
            </div>

            {/* Skills Display */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* {displayData?.userSkills && displayData?.userSkills.length > 0 ? (
                displayData?.userSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                      >
              {Array.isArray(displayData?.userSkills) && displayData.userSkills.length > 0 ? (
                displayData.userSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                  >
                    <span>
                      {skill.name}
                    </span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill.name)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No skills added yet
                </p>
              )}
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No skills added yet
                </p>
              )}
            </div>

            {/* Add Skill Input (only in edit mode) */}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Add a new skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              )}

              {/* Skills Note */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Pro Tip:</strong> Skills will be automatically
                  suggested when you complete assignments. Keep your skills
                  updated to showcase your growing expertise!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;