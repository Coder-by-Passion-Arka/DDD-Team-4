import { apiService } from "./api";

export interface Achievement {
  _id: string;
  userId: string;
  title: string;
  description: string;
  type: string;
  category: string;
  icon: string;
  points: number;
  earnedAt: string;
  criteria?: {
    assignmentCount?: number;
    minScore?: number;
    streakDays?: number;
    evaluationCount?: number;
    skillCount?: number;
  };
  context?: {
    assignmentId?: string;
    score?: number;
    relatedData?: any;
  };
  isVisible: boolean;
}

export interface AchievementStats {
  overview: {
    totalAchievements: number;
    totalPoints: number;
    categories: string[];
    latestAchievement: string | null;
  };
  byCategory: Array<{
    _id: string;
    count: number;
    points: number;
  }>;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAchievements: number;
    achievementsPerPage: number;
  };
  totalPoints: number;
}

export interface CreateAchievementData {
  userId?: string;
  title: string;
  description: string;
  type: string;
  category: string;
  icon?: string;
  points?: number;
  criteria?: any;
  context?: any;
}

export interface LeaderboardEntry {
  userId: string;
  totalPoints: number;
  totalAchievements: number;
  categories: string[];
  latestAchievement: string;
  user: {
    userName: string;
    userProfileImage: string;
    userRole: string;
  };
}

// ✅ Added type for achievement categories
type AchievementCategory =
  | "academic"
  | "collaboration"
  | "milestones"
  | "skills"
  | "teaching"
  | "mentorship"
  | "management"
  | "leadership";

class AchievementApiService {
  async getUserAchievements(params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
  }): Promise<AchievementsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.type) queryParams.append("type", params.type);

    const url = `/v1/achievements${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiService.get<AchievementsResponse>(url);
  }

  async getAchievementStats(): Promise<AchievementStats> {
    return apiService.get<AchievementStats>("/v1/achievements/stats");
  }

  async getAchievement(achievementId: string): Promise<Achievement> {
    return apiService.get<Achievement>(`/v1/achievements/${achievementId}`);
  }

  async createAchievement(data: CreateAchievementData): Promise<Achievement> {
    return apiService.post<Achievement>("/v1/achievements/award", data);
  }

  async updateAchievement(
    achievementId: string,
    data: Partial<Achievement>
  ): Promise<Achievement> {
    return apiService.patch<Achievement>(
      `/v1/achievements/${achievementId}`,
      data
    );
  }

  async deleteAchievement(achievementId: string): Promise<void> {
    return apiService.delete<void>(`/v1/achievements/${achievementId}`);
  }

  async getLeaderboard(params?: {
    category?: string;
    limit?: number;
  }): Promise<LeaderboardEntry[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `/v1/achievements/leaderboard${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiService.get<LeaderboardEntry[]>(url);
  }

  async getUserAchievementsAsAdmin(
    userId: string,
    params?: { page?: number; limit?: number; category?: string }
  ): Promise<AchievementsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);

    const url = `/v1/achievements/admin/user/${userId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiService.get<AchievementsResponse>(url);
  }

  async teacherAwardAchievement(
    data: CreateAchievementData & { userId: string }
  ): Promise<Achievement> {
    return apiService.post<Achievement>("/v1/achievements/teacher/award", data);
  }

  async adminAwardAchievement(
    data: CreateAchievementData
  ): Promise<Achievement> {
    return apiService.post<Achievement>("/v1/achievements/admin/award", data);
  }

  async bulkAwardAchievements(data: {
    userIds: string[];
    title: string;
    description: string;
    type: string;
    category: string;
    icon?: string;
    points?: number;
  }): Promise<
    Array<{
      userId: string;
      success: boolean;
      achievement?: Achievement;
      error?: string;
    }>
  > {
    return apiService.post("/achievements/admin/bulk/award", data);
  }

  static canManageAchievements(userRole: string): boolean {
    return ["teacher", "admin"].includes(userRole);
  }

  static canDeleteAchievements(userRole: string): boolean {
    return userRole === "admin";
  }

  static getAchievementCategories(userRole: string): string[] {
    const commonCategories = [
      "academic",
      "collaboration",
      "milestones",
      "skills",
    ];

    switch (userRole) {
      case "teacher":
        return [...commonCategories, "teaching", "mentorship"];
      case "admin":
        return [...commonCategories, "management", "leadership"];
      default:
        return commonCategories;
    }
  }

  // ✅ Type-safe version using AchievementCategory type
  static getAchievementTypes(category: string): string[] {
    const typesByCategory: Record<AchievementCategory, string[]> = {
      academic: [
        "perfect_score",
        "academic_excellence",
        "consistent_performer",
      ],
      collaboration: [
        "helpful_peer",
        "collaboration_champion",
        "feedback_hero",
      ],
      milestones: ["first_assignment", "assignment_streak"],
      skills: ["skill_master"],
      teaching: [
        "excellent_teacher",
        "student_favorite",
        "innovative_pedagogy",
      ],
      mentorship: ["mentor", "guidance_expert"],
      management: ["platform_growth", "system_excellence"],
      leadership: ["team_builder", "strategic_thinker"],
    };

    if (category in typesByCategory) {
      return typesByCategory[category as AchievementCategory];
    }

    return [];
  }
}

const achievementApi = new AchievementApiService();

export default achievementApi;