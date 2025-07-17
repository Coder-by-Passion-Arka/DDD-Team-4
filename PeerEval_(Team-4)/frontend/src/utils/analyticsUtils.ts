// Analytics utilities for generating realistic dummy data and calculations

export interface DailyData {
  date: string; // YYYY-MM-DD format
  day: string; // Mon, Tue, etc.
  submissions: number;
  evaluations: number;
  videoWatchTime: number; // minutes watched
  quizParticipation: number; // number of quizzes taken
  weekIndex: number; // 0-3 for weeks in a month
  monthIndex: number; // 0-5 for months in a semester
  semesterIndex: number; // 0 for previous, 1 for current
}

export interface ProgressData {
  day: string;
  submissions: number;
  evaluations: number;
  videoWatchTime?: number;
  quizParticipation?: number;
  date?: string;
  weekIndex?: number;
  monthIndex?: number;
  semesterIndex?: number;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  streakStartDate: string;
  todayHasActivity: boolean;
  streakHistory: Array<{
    date: string;
    hasActivity: boolean;
    activities: {
      submissions: number;
      evaluations: number;
      videoWatchTime: number;
      quizParticipation: number;
    };
  }>;
}

export interface AnalyticsMetrics {
  totalSubmissions: number;
  totalEvaluations: number;
  averageDaily: number;
  growthRate: number;
  bestDay: string;
  efficiency: number;
}

export interface ViewContext {
  level: 'semester' | 'monthly' | 'weekly' | 'daily';
  selectedSemesterIndex?: number;
  selectedMonthIndex?: number;
  selectedWeekIndex?: number;
  title: string;
  breadcrumb: string[];
}

export interface SemesterInfo {
  name: string;
  startMonth: number; // 0-based (0 = January)
  endMonth: number;   // 0-based
  months: string[];
  isActive: boolean;
}

// Define semester structure
export const SEMESTER_CONFIG: SemesterInfo[] = [
  {
    name: 'Previous Semester (Dec - Apr)',
    startMonth: 11, // December (previous year)
    endMonth: 3,    // April
    months: ['December', 'January', 'February', 'March', 'April'],
    isActive: false,
  },
  {
    name: 'Current Semester (Jul - Nov)',
    startMonth: 6,  // July
    endMonth: 10,   // November
    months: ['July', 'August', 'September', 'October', 'November'],
    isActive: true,
  },
];

// Get current semester index based on current date
export const getCurrentSemesterIndex = (): number => {
  const currentMonth = new Date().getMonth(); // 0-based
  
  // July (6) to November (10) = Current Semester (index 1)
  if (currentMonth >= 6 && currentMonth <= 10) {
    return 1;
  }
  // December (11) or January (0) to April (3) = Previous Semester (index 0)
  else {
    return 0;
  }
};

// Generate a week's worth of daily data with realistic patterns
// Seeded random number generator for consistent data
let seed = 12345; // Fixed seed for consistent data
const seededRandom = (): number => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

// Reset seed for each new data generation session
const resetSeed = () => {
  seed = 12345;
};

// Day names
const DAILY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Daily activity patterns (base values for realistic variation)
const dailyPatterns = [
  { submissions: 6, evaluations: 4, videoWatchTime: 45, quizParticipation: 2 }, // Monday
  { submissions: 8, evaluations: 6, videoWatchTime: 60, quizParticipation: 3 }, // Tuesday
  { submissions: 7, evaluations: 8, videoWatchTime: 40, quizParticipation: 2 }, // Wednesday
  { submissions: 9, evaluations: 5, videoWatchTime: 55, quizParticipation: 4 }, // Thursday
  { submissions: 6, evaluations: 7, videoWatchTime: 35, quizParticipation: 2 }, // Friday
  { submissions: 3, evaluations: 2, videoWatchTime: 20, quizParticipation: 1 }, // Saturday
  { submissions: 4, evaluations: 3, videoWatchTime: 25, quizParticipation: 1 }  // Sunday
];

// Generate weekly daily data with deterministic variation
export const generateWeeklyDailyData = (weekIndex: number, monthIndex: number, semesterIndex: number): DailyData[] => {
  // Reset seed for consistent data generation
  resetSeed();
  
  return DAILY_NAMES.map((dayName, dayIndex) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Calculate actual month for date generation
    const semester = SEMESTER_CONFIG[semesterIndex];
    const actualMonthIndex = semester.startMonth + monthIndex;
    const adjustedYear = actualMonthIndex >= 12 ? currentYear + 1 : currentYear;
    const adjustedMonth = actualMonthIndex >= 12 ? actualMonthIndex - 12 : actualMonthIndex;
    
    const baseDay = new Date(adjustedYear, adjustedMonth, weekIndex * 7 + dayIndex + 1);
    const dateStr = baseDay.toISOString().split('T')[0];
    
    const pattern = dailyPatterns[dayIndex];
    const weekVariation = 1 + (Math.sin(weekIndex * 0.5) * 0.2); // Week-to-week variation
    const monthVariation = 1 + (Math.cos(monthIndex * 0.3) * 0.15); // Month-to-month variation
    const randomVariation = 0.7 + seededRandom() * 0.6; // 70%-130% of base - now deterministic
    
    const totalVariation = weekVariation * monthVariation * randomVariation;
    
    return {
      date: dateStr,
      day: dayName,
      submissions: Math.max(1, Math.round(pattern.submissions * totalVariation)),
      evaluations: Math.max(1, Math.round(pattern.evaluations * totalVariation)),
      videoWatchTime: Math.max(0, Math.round(pattern.videoWatchTime * totalVariation)),
      quizParticipation: Math.max(0, Math.round(pattern.quizParticipation * totalVariation)),
      weekIndex,
      monthIndex,
      semesterIndex,
    };
  });
};

// Generate all daily data for both semesters (only up to current date)
export const generateAllDailyData = (): DailyData[] => {
  const allData: DailyData[] = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based (July = 6)
  
  // Generate data for both semesters
  SEMESTER_CONFIG.forEach((semester, semesterIndex) => {
    // Generate data for months in the semester
    semester.months.forEach((_, monthIndex) => {
      // Calculate actual calendar month for this semester month
      const actualMonthIndex = semester.startMonth + monthIndex;
      const adjustedMonth = actualMonthIndex >= 12 ? actualMonthIndex - 12 : actualMonthIndex;
      
      // For current semester, only generate data up to current month
      if (semesterIndex === 1) { // Current semester (Jul-Nov)
        if (adjustedMonth > currentMonth) {
          console.log(`⏭️ Skipping future month: ${semester.months[monthIndex]} (${adjustedMonth} > ${currentMonth})`);
          return; // Skip future months
        }
      }
      
      // For previous semester, generate all months
      // For current semester, only up to current month
      console.log(`📅 Generating data for: ${semester.months[monthIndex]} (Semester ${semesterIndex})`);
      
      // Generate 4 weeks per month
      for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
        const weekData = generateWeeklyDailyData(weekIndex, monthIndex, semesterIndex);
        allData.push(...weekData);
      }
    });
  });
  
  console.log(`✅ Generated ${allData.length} daily records (up to current date)`);
  return allData;
};

// Aggregate daily data into weekly summaries
export const aggregateToWeekly = (dailyData: DailyData[], semesterIndex?: number, monthIndex?: number): ProgressData[] => {
  let filteredData = dailyData;
  
  if (semesterIndex !== undefined) {
    filteredData = filteredData.filter(d => d.semesterIndex === semesterIndex);
  }
  
  if (monthIndex !== undefined) {
    filteredData = filteredData.filter(d => d.monthIndex === monthIndex);
  }
  
  const weeklyAggregates: { [key: string]: { 
    submissions: number; 
    evaluations: number; 
    videoWatchTime: number; 
    quizParticipation: number; 
    weekIndex: number; 
    monthIndex: number; 
    semesterIndex: number 
  } } = {};
  
  filteredData.forEach(day => {
    const key = monthIndex !== undefined 
      ? `${day.semesterIndex}-${day.monthIndex}-${day.weekIndex}`
      : `${day.semesterIndex}-${day.monthIndex}-${day.weekIndex}`;
    
    if (!weeklyAggregates[key]) {
      weeklyAggregates[key] = { 
        submissions: 0, 
        evaluations: 0, 
        videoWatchTime: 0,
        quizParticipation: 0,
        weekIndex: day.weekIndex, 
        monthIndex: day.monthIndex,
        semesterIndex: day.semesterIndex
      };
    }
    weeklyAggregates[key].submissions += day.submissions;
    weeklyAggregates[key].evaluations += day.evaluations;
    weeklyAggregates[key].videoWatchTime += day.videoWatchTime;
    weeklyAggregates[key].quizParticipation += day.quizParticipation;
  });
  
  return Object.entries(weeklyAggregates).map(([, data]) => ({
    day: monthIndex !== undefined ? `Week ${data.weekIndex + 1}` : `${SEMESTER_CONFIG[data.semesterIndex].months[data.monthIndex]} W${data.weekIndex + 1}`,
    submissions: data.submissions,
    evaluations: data.evaluations,
    videoWatchTime: data.videoWatchTime,
    quizParticipation: data.quizParticipation,
    weekIndex: data.weekIndex,
    monthIndex: data.monthIndex,
    semesterIndex: data.semesterIndex,
  }));
};

// Aggregate daily data into monthly summaries
export const aggregateToMonthly = (dailyData: DailyData[], semesterIndex?: number): ProgressData[] => {
  let filteredData = dailyData;
  
  if (semesterIndex !== undefined) {
    filteredData = filteredData.filter(d => d.semesterIndex === semesterIndex);
  }
  
  const monthlyAggregates: { [key: string]: { submissions: number; evaluations: number; monthIndex: number; semesterIndex: number } } = {};
  
  filteredData.forEach(day => {
    const key = `${day.semesterIndex}-${day.monthIndex}`;
    if (!monthlyAggregates[key]) {
      monthlyAggregates[key] = { 
        submissions: 0, 
        evaluations: 0, 
        monthIndex: day.monthIndex,
        semesterIndex: day.semesterIndex
      };
    }
    monthlyAggregates[key].submissions += day.submissions;
    monthlyAggregates[key].evaluations += day.evaluations;
  });
  
  return Object.entries(monthlyAggregates).map(([, data]) => ({
    day: SEMESTER_CONFIG[data.semesterIndex].months[data.monthIndex],
    submissions: data.submissions,
    evaluations: data.evaluations,
    monthIndex: data.monthIndex,
    semesterIndex: data.semesterIndex,
  }));
};

// Aggregate daily data into semester summaries
export const aggregateToSemester = (dailyData: DailyData[]): ProgressData[] => {
  const semesterAggregates: { [key: number]: { submissions: number; evaluations: number } } = {};
  
  dailyData.forEach(day => {
    if (!semesterAggregates[day.semesterIndex]) {
      semesterAggregates[day.semesterIndex] = { submissions: 0, evaluations: 0 };
    }
    semesterAggregates[day.semesterIndex].submissions += day.submissions;
    semesterAggregates[day.semesterIndex].evaluations += day.evaluations;
  });
  
  return Object.entries(semesterAggregates).map(([semesterIndex, data]) => ({
    day: SEMESTER_CONFIG[parseInt(semesterIndex)].name,
    submissions: data.submissions,
    evaluations: data.evaluations,
    semesterIndex: parseInt(semesterIndex),
  }));
};

// Get data for specific view level
export const getDataForView = (
  dailyData: DailyData[], 
  context: ViewContext
): ProgressData[] => {
  switch (context.level) {
    case 'semester':
      return aggregateToSemester(dailyData);
      
    case 'monthly':
      if (context.selectedSemesterIndex !== undefined) {
        return aggregateToMonthly(dailyData, context.selectedSemesterIndex);
      }
      return aggregateToMonthly(dailyData);
      
    case 'weekly':
      if (context.selectedSemesterIndex !== undefined && context.selectedMonthIndex !== undefined) {
        return aggregateToWeekly(dailyData, context.selectedSemesterIndex, context.selectedMonthIndex);
      } else if (context.selectedSemesterIndex !== undefined) {
        return aggregateToWeekly(dailyData, context.selectedSemesterIndex);
      }
      return aggregateToWeekly(dailyData);
      
    case 'daily':
      if (context.selectedSemesterIndex !== undefined && context.selectedMonthIndex !== undefined && context.selectedWeekIndex !== undefined) {
        return dailyData
          .filter(d => 
            d.semesterIndex === context.selectedSemesterIndex && 
            d.monthIndex === context.selectedMonthIndex && 
            d.weekIndex === context.selectedWeekIndex
          )
          .map(d => ({
            day: d.day,
            submissions: d.submissions,
            evaluations: d.evaluations,
            date: d.date,
          }));
      }
      return [];
      
    default:
      return aggregateToSemester(dailyData);
  }
};

// Calculate analytics metrics from data
export const calculateAnalytics = (data: ProgressData[], activeView: 'submissions' | 'evaluations'): AnalyticsMetrics => {
  if (data.length === 0) {
    return {
      totalSubmissions: 0,
      totalEvaluations: 0,
      averageDaily: 0,
      growthRate: 0,
      bestDay: 'N/A',
      efficiency: 0,
    };
  }

  const values = data.map(item => activeView === 'submissions' ? item.submissions : item.evaluations);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / data.length;

  // Find best performing day
  const maxIndex = values.indexOf(Math.max(...values));
  const bestDay = data[maxIndex]?.day || "N/A";

  // Calculate growth rate (last value vs first value)
  const growthRate =
    data.length > 1
      ? ((values[values.length - 1] - values[0]) / values[0]) * 100
      : 0;

  // Calculate efficiency (ratio of evaluations to submissions)
  const totalSubmissions = data.reduce(
    (sum, item) => sum + item.submissions,
    0
  );
  const totalEvaluations = data.reduce(
    (sum, item) => sum + item.evaluations,
    0
  );
  const efficiency =
    totalSubmissions > 0 ? (totalEvaluations / totalSubmissions) * 100 : 0;

  return {
    totalSubmissions: data.reduce((sum, item) => sum + item.submissions, 0),
    totalEvaluations: data.reduce((sum, item) => sum + item.evaluations, 0),
    averageDaily: Math.round(average * 10) / 10,
    growthRate: Math.round(growthRate * 10) / 10,
    bestDay,
    efficiency: Math.round(efficiency * 10) / 10,
  };
};

// Generate trending insights
export const generateInsights = (data: ProgressData[], context: ViewContext): string[] => {
  const analytics = calculateAnalytics(data, 'submissions');
  const insights: string[] = [];

  if (analytics.growthRate > 10) {
    insights.push(`📈 Great momentum! ${analytics.growthRate}% growth in this ${context.level.slice(0, -2)} view`);
  } else if (analytics.growthRate < -10) {
    insights.push(`📉 Consider reviewing your ${context.level.slice(0, -2)} strategy`);
  }

  if (analytics.efficiency > 80) {
    insights.push(
      `⚡ Excellent evaluation efficiency at ${analytics.efficiency}%`
    );
  } else if (analytics.efficiency < 50) {
    insights.push(`🎯 Focus on completing more evaluations`);
  }

  insights.push(`🏆 Peak performance on ${analytics.bestDay}`);

  if (analytics.averageDaily > 5) {
    insights.push(`🔥 Consistent activity with ${analytics.averageDaily} avg ${context.level === 'daily' ? 'daily' : 'period'} submissions`);
  }
  
  return insights;
};

// Helper function to create navigation context
export const createViewContext = (
  level: 'semester' | 'monthly' | 'weekly' | 'daily',
  selectedSemesterIndex?: number,
  selectedMonthIndex?: number,
  selectedWeekIndex?: number
): ViewContext => {
  let title = '';
  let breadcrumb: string[] = [];
  
  switch (level) {
    case 'semester':
      title = 'Academic Year Overview';
      breadcrumb = ['Academic Year'];
      break;
      
    case 'monthly':
      if (selectedSemesterIndex !== undefined) {
        const semesterName = SEMESTER_CONFIG[selectedSemesterIndex].name;
        title = `${semesterName} - Months`;
        breadcrumb = ['Academic Year', semesterName];
      } else {
        title = 'All Months';
        breadcrumb = ['Academic Year', 'All Months'];
      }
      break;
      
    case 'weekly':
      if (selectedSemesterIndex !== undefined && selectedMonthIndex !== undefined) {
        const semesterName = SEMESTER_CONFIG[selectedSemesterIndex].name;
        const monthName = SEMESTER_CONFIG[selectedSemesterIndex].months[selectedMonthIndex];
        title = `${monthName} - Weeks`;
        breadcrumb = ['Academic Year', semesterName, monthName];
      } else if (selectedSemesterIndex !== undefined) {
        const semesterName = SEMESTER_CONFIG[selectedSemesterIndex].name;
        title = `${semesterName} - All Weeks`;
        breadcrumb = ['Academic Year', semesterName, 'All Weeks'];
      } else {
        title = 'All Weeks';
        breadcrumb = ['Academic Year', 'All Weeks'];
      }
      break;
      
    case 'daily':
      if (selectedSemesterIndex !== undefined && selectedMonthIndex !== undefined && selectedWeekIndex !== undefined) {
        const semesterName = SEMESTER_CONFIG[selectedSemesterIndex].name;
        const monthName = SEMESTER_CONFIG[selectedSemesterIndex].months[selectedMonthIndex];
        title = `${monthName} - Week ${selectedWeekIndex + 1} - Days`;
        breadcrumb = ['Academic Year', semesterName, monthName, `Week ${selectedWeekIndex + 1}`];
      } else {
        title = 'Daily View';
        breadcrumb = ['Academic Year', 'Daily View'];
      }
      break;
  }
  
  return {
    level,
    selectedSemesterIndex,
    selectedMonthIndex,
    selectedWeekIndex,
    title,
    breadcrumb,
  };
};

// ========================================================================================
// STREAK CALCULATION UTILITIES
// ========================================================================================

/**
 * Determines if a day has sufficient activity to maintain streak
 * A day counts as active if ANY of the following conditions are met:
 * - Has submissions (any count > 0)
 * - Has evaluations (any count > 0) 
 * - Has video watch time (>= 10 minutes)
 * - Has quiz participation (any count > 0)
 */
export const hasActivityForDay = (dayData: DailyData): boolean => {
  return (
    dayData.submissions > 0 ||
    dayData.evaluations > 0 ||
    dayData.videoWatchTime >= 10 || // At least 10 minutes of video watching
    dayData.quizParticipation > 0
  );
};

/**
 * Calculate streak data from daily activity data
 */
export const calculateStreakData = (dailyData: DailyData[]): StreakData => {
  // Sort data by date (most recent first)
  const sortedData = [...dailyData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (sortedData.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: '',
      streakStartDate: '',
      todayHasActivity: false,
      streakHistory: [],
    };
  }
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Create streak history
  const streakHistory = sortedData.map(day => ({
    date: day.date,
    hasActivity: hasActivityForDay(day),
    activities: {
      submissions: day.submissions,
      evaluations: day.evaluations,
      videoWatchTime: day.videoWatchTime,
      quizParticipation: day.quizParticipation,
    },
  }));
  
  // Check if today has activity
  const todayData = sortedData.find(day => day.date === today);
  const todayHasActivity = todayData ? hasActivityForDay(todayData) : false;
  
  // Calculate current streak
  let currentStreak = 0;
  let streakStartDate = '';
  let lastActiveDate = '';
  
  // Start from most recent day and work backwards
  for (let i = 0; i < sortedData.length; i++) {
    const day = sortedData[i];
    const hasActivity = hasActivityForDay(day);
    
    if (hasActivity) {
      if (!lastActiveDate) {
        lastActiveDate = day.date;
      }
      
      // Check if this continues the streak
      if (i === 0) {
        // First day (most recent)
        currentStreak = 1;
        streakStartDate = day.date;
      } else {
        // Check if previous day also had activity
        const prevDay = sortedData[i - 1];
        const prevDate = new Date(prevDay.date);
        const currentDate = new Date(day.date);
        const daysDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000));
        
        if (daysDiff === 1) {
          // Consecutive day
          currentStreak++;
          streakStartDate = day.date;
        } else {
          // Gap in streak, stop counting
          break;
        }
      }
    } else if (i === 0) {
      // Most recent day has no activity, check if yesterday had activity
      const yesterdayData = sortedData.find(day => day.date === yesterday);
      if (yesterdayData && hasActivityForDay(yesterdayData)) {
        // Yesterday had activity, so current streak starts from yesterday
        currentStreak = 1;
        streakStartDate = yesterday;
        lastActiveDate = yesterday;
        break;
      } else {
        // No recent activity
        break;
      }
    } else {
      // Found a day with no activity, streak is broken
      break;
    }
  }
  
  // Calculate best streak
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Go through all data chronologically to find best streak
  const chronologicalData = [...sortedData].reverse();
  
  for (const day of chronologicalData) {
    if (hasActivityForDay(day)) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    lastActiveDate,
    streakStartDate,
    todayHasActivity,
    streakHistory,
  };
};

/**
 * Get streak insights and motivational messages
 */
export const getStreakInsights = (streakData: StreakData): string[] => {
  const insights: string[] = [];
  const { currentStreak, bestStreak, todayHasActivity } = streakData;
  
  if (currentStreak === 0) {
    insights.push("🔥 Start your streak today! Complete any activity to begin.");
  } else if (currentStreak === 1) {
    insights.push("🌱 Great start! Keep going to build your streak.");
  } else if (currentStreak < 7) {
    insights.push(`🔥 ${currentStreak} days strong! Almost at your first week.`);
  } else if (currentStreak < 30) {
    insights.push(`⚡ ${currentStreak} day streak! You're building great habits.`);
  } else if (currentStreak < 100) {
    insights.push(`🏆 Incredible ${currentStreak} day streak! You're on fire!`);
  } else {
    insights.push(`🌟 Legendary ${currentStreak} day streak! You're unstoppable!`);
  }
  
  if (currentStreak === bestStreak && currentStreak > 7) {
    insights.push("🎯 Personal best! You're achieving new heights.");
  }
  
  if (!todayHasActivity && currentStreak > 0) {
    insights.push("⏰ Don't break your streak! Complete an activity today.");
  }
  
  // Milestone messages
  const nextMilestone = getNextMilestone(currentStreak);
  if (nextMilestone) {
    const daysToGo = nextMilestone - currentStreak;
    insights.push(`🎖️ ${daysToGo} more days to reach ${nextMilestone}-day milestone!`);
  }

  return insights;
};

/**
 * Get the next streak milestone
 */
const getNextMilestone = (currentStreak: number): number | null => {
  const milestones = [7, 14, 30, 50, 100, 200, 365];
  return milestones.find(milestone => milestone > currentStreak) || null;
};

/**
 * Get streak risk level based on recent activity
 */
export const getStreakRisk = (streakData: StreakData): 'safe' | 'warning' | 'danger' => {
  if (streakData.currentStreak === 0) return 'safe';
  
  const today = new Date().toISOString().split('T')[0];
  const todayData = streakData.streakHistory.find(day => day.date === today);
  
  if (todayData && todayData.hasActivity) {
    return 'safe'; // Already completed today
  }
  
  const currentHour = new Date().getHours();
  
  if (currentHour < 12) {
    return 'safe'; // Still morning, plenty of time
  } else if (currentHour < 18) {
    return 'warning'; // Afternoon, should start thinking about it
  } else {
    return 'danger'; // Evening, risk of breaking streak
  }
};
