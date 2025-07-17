// StreakContext.tsx - Manages user streak data with real-time updates
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  StreakData, 
  DailyData, 
  calculateStreakData, 
  getStreakInsights, 
  getStreakRisk,
  generateAllDailyData 
} from '../utils/analyticsUtils';

interface StreakContextType {
  streakData: StreakData;
  insights: string[];
  riskLevel: 'safe' | 'warning' | 'danger';
  isLoading: boolean;
  refreshStreak: () => void;
  recordActivity: (activityType: 'submission' | 'evaluation' | 'video' | 'quiz', amount?: number) => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: '',
    streakStartDate: '',
    todayHasActivity: false,
    streakHistory: [],
  });
  const [insights, setInsights] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState<'safe' | 'warning' | 'danger'>('safe');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate streak data from analytics
  const calculateStreaks = (dailyData: DailyData[]) => {
    console.log('🔥 Calculating streak data from', dailyData.length, 'daily records');
    
    const calculated = calculateStreakData(dailyData);
    const streakInsights = getStreakInsights(calculated);
    const risk = getStreakRisk(calculated);
    
    console.log('🔥 Streak calculation results:', {
      currentStreak: calculated.currentStreak,
      bestStreak: calculated.bestStreak,
      todayHasActivity: calculated.todayHasActivity,
      riskLevel: risk
    });
    
    setStreakData(calculated);
    setInsights(streakInsights);
    setRiskLevel(risk);
  };

  // Load initial streak data
  useEffect(() => {
    const loadStreakData = () => {
      try {
        setIsLoading(true);
        
        // Generate daily data (this will include the new video and quiz fields)
        const allDailyData = generateAllDailyData();
        
        // Calculate streaks
        calculateStreaks(allDailyData);
        
      } catch (error) {
        console.error('❌ Error loading streak data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStreakData();
  }, []);

  // Auto-refresh streak data every hour to check for new activity
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing streak data...');
      refreshStreak();
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, []);

  // Refresh streak calculations
  const refreshStreak = () => {
    console.log('🔄 Refreshing streak data...');
    const allDailyData = generateAllDailyData();
    calculateStreaks(allDailyData);
  };

  // Record new activity (for future integration with real backend)
  const recordActivity = (activityType: 'submission' | 'evaluation' | 'video' | 'quiz', amount: number = 1) => {
    console.log(`📝 Recording ${activityType} activity:`, amount);
    
    // For now, this is a placeholder. In the future, this would:
    // 1. Send activity to backend
    // 2. Update today's activity count
    // 3. Recalculate streaks
    
    // Simulate immediate effect on today's activity
    const today = new Date().toISOString().split('T')[0];
    const updatedData = { ...streakData };
    
    // Update today's activity in streak history
    const todayIndex = updatedData.streakHistory.findIndex(day => day.date === today);
    if (todayIndex >= 0) {
      const todayRecord = updatedData.streakHistory[todayIndex];
      
      switch (activityType) {
        case 'submission':
          todayRecord.activities.submissions += amount;
          break;
        case 'evaluation':
          todayRecord.activities.evaluations += amount;
          break;
        case 'video':
          todayRecord.activities.videoWatchTime += amount;
          break;
        case 'quiz':
          todayRecord.activities.quizParticipation += amount;
          break;
      }
      
      // Recalculate if this day now has activity
      todayRecord.hasActivity = (
        todayRecord.activities.submissions > 0 ||
        todayRecord.activities.evaluations > 0 ||
        todayRecord.activities.videoWatchTime >= 10 ||
        todayRecord.activities.quizParticipation > 0
      );
      
      // If today now has activity and didn't before, potentially extend streak
      if (todayRecord.hasActivity && !updatedData.todayHasActivity) {
        updatedData.currentStreak += 1;
        updatedData.todayHasActivity = true;
        updatedData.lastActiveDate = today;
        
        if (updatedData.currentStreak === 1) {
          updatedData.streakStartDate = today;
        }
        
        // Update best streak if needed
        updatedData.bestStreak = Math.max(updatedData.bestStreak, updatedData.currentStreak);
      }
      
      setStreakData(updatedData);
      setInsights(getStreakInsights(updatedData));
      setRiskLevel(getStreakRisk(updatedData));
    }
  };

  const value: StreakContextType = {
    streakData,
    insights,
    riskLevel,
    isLoading,
    refreshStreak,
    recordActivity,
  };

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = (): StreakContextType => {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};
