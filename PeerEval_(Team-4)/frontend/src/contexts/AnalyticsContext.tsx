// Analytics Context for consistent data across all pages
// Ensures same dummy data is used throughout the application

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  generateAllDailyData, 
  getCurrentSemesterIndex,
  aggregateToSemester,
  aggregateToMonthly, 
  aggregateToWeekly,
  DailyData,
  ProgressData
} from '../utils/analyticsUtils';

interface AnalyticsContextType {
  allDailyData: DailyData[];
  currentSemesterIndex: number;
  setCurrentSemesterIndex: (index: number) => void;
  isLoading: boolean;
  lastDataUpdate: string;
  refreshData: () => void;
  // Helper functions for consistent data access
  getSemesterData: () => ProgressData[];
  getCurrentSemesterData: () => ProgressData[];
  getPreviousSemesterData: () => ProgressData[];
  getMonthlyData: (semesterIndex?: number) => ProgressData[];
  getWeeklyData: (semesterIndex?: number, monthIndex?: number) => ProgressData[];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [allDailyData, setAllDailyData] = useState<DailyData[]>([]);
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState<number>(getCurrentSemesterIndex());
  const [isLoading, setIsLoading] = useState(true);
  const [lastDataUpdate, setLastDataUpdate] = useState<string>('');

  // Initialize data once on app startup and refresh daily
  useEffect(() => {
    const initializeAnalyticsData = () => {
      console.log('🔄 Initializing analytics data...');
      setIsLoading(true);
      
      // Generate consistent dummy data based on current date
      const data = generateAllDailyData();
      setAllDailyData(data);
      setLastDataUpdate(new Date().toLocaleString());
      
      console.log(`✅ Analytics data initialized with ${data.length} daily records`);
      console.log(`📊 Current semester: ${currentSemesterIndex === 0 ? 'Previous (Dec-Apr)' : 'Current (Jul-Nov)'}`);
      console.log(`📅 Data generated up to: ${new Date().toLocaleDateString()}`);
      
      setIsLoading(false);
    };

    // Initialize data
    initializeAnalyticsData();

    // Set up daily refresh to check for new months
    const checkForNewMonth = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Only refresh if it's a reasonable time (not middle of night)
      if (currentHour >= 6 && currentHour <= 23) {
        console.log('🔄 Checking for new month data...');
        initializeAnalyticsData();
      }
    };

    // Check every hour for new month data
    const interval = setInterval(checkForNewMonth, 60 * 60 * 1000); // 1 hour

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []); // Only run once on mount

  // Manual refresh function
  const refreshData = () => {
    console.log('🔄 Manual data refresh requested...');
    const data = generateAllDailyData();
    setAllDailyData(data);
    setLastDataUpdate(new Date().toLocaleString());
    console.log(`✅ Data refreshed with ${data.length} records at ${new Date().toLocaleString()}`);
  };

  const value: AnalyticsContextType = {
    allDailyData,
    currentSemesterIndex,
    setCurrentSemesterIndex,
    isLoading,
    lastDataUpdate,
    refreshData,
    // Helper functions for consistent data access
    getSemesterData: () => aggregateToSemester(allDailyData),
    getCurrentSemesterData: () => aggregateToMonthly(allDailyData.filter(d => d.semesterIndex === currentSemesterIndex)),
    getPreviousSemesterData: () => aggregateToMonthly(allDailyData.filter(d => d.semesterIndex === (currentSemesterIndex === 1 ? 0 : 1))),
    getMonthlyData: (semesterIndex?: number) => aggregateToMonthly(allDailyData, semesterIndex),
    getWeeklyData: (semesterIndex?: number, monthIndex?: number) => aggregateToWeekly(allDailyData, semesterIndex, monthIndex),
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook to use analytics context
export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Export for convenience
export default AnalyticsContext;
