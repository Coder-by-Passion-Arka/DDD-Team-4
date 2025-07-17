// Interactive Analytics Chart with drill-down functionality
// Supports Semester → Monthly → Weekly → Daily navigation

import React, { useState } from 'react';
import { 
  getDataForView, 
  calculateAnalytics, 
  generateInsights,
  createViewContext,
  getCurrentSemesterIndex,
  SEMESTER_CONFIG,
  ProgressData,
  ViewContext
} from '../utils/analyticsUtils';
import { useAnalytics } from '../contexts/AnalyticsContext';

// Simple chart icons as SVG components
const BarChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface ProgressChartProps {
  // Props can be added here if needed in the future
}

const ProgressChart: React.FC<ProgressChartProps> = () => {
  const { allDailyData, currentSemesterIndex, setCurrentSemesterIndex, isLoading, lastDataUpdate, refreshData } = useAnalytics();
  const [activeView, setActiveView] = useState<'submissions' | 'evaluations'>('submissions');
  const [viewContext, setViewContext] = useState<ViewContext>(
    createViewContext('monthly', getCurrentSemesterIndex()) // Start with monthly view of current semester
  );

  // Initialize data on component mount - now handled by context

  // Get current display data based on view context and selected semester
  const getCurrentDisplayData = (): ProgressData[] => {
    if (viewContext.level === 'semester') {
      // Show both semesters for comparison, but filter by currentSemesterIndex for single semester view
      return getDataForView(allDailyData.filter(d => d.semesterIndex === currentSemesterIndex), {
        ...viewContext,
        level: 'monthly', // Show monthly data for selected semester
        selectedSemesterIndex: currentSemesterIndex
      });
    } else {
      // Filter data for selected semester in detailed views
      const semesterFilteredData = allDailyData.filter(d => 
        d.semesterIndex === (viewContext.selectedSemesterIndex ?? currentSemesterIndex)
      );
      return getDataForView(semesterFilteredData, viewContext);
    }
  };

  const currentData = getCurrentDisplayData();
  const analytics = calculateAnalytics(currentData, activeView);
  const insights = generateInsights(currentData, viewContext);

  // Handle clicking on a bar to drill down
  const handleBarClick = (item: ProgressData) => {
    if (viewContext.level === 'semester') {
      // Click on semester -> show months for that semester
      setViewContext(createViewContext('monthly', item.semesterIndex));
    } else if (viewContext.level === 'monthly') {
      // Click on month -> show weeks for that month
      setViewContext(createViewContext('weekly', viewContext.selectedSemesterIndex, item.monthIndex));
    } else if (viewContext.level === 'weekly') {
      // Click on week -> show days for that week
      setViewContext(createViewContext('daily', viewContext.selectedSemesterIndex, viewContext.selectedMonthIndex, item.weekIndex));
    }
    // Daily level is the deepest - no further drill down
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (level: number) => {
    if (level === 0) {
      // Back to semester view
      setViewContext(createViewContext('semester'));
    } else if (level === 1 && viewContext.selectedSemesterIndex !== undefined) {
      // Back to monthly view for selected semester
      setViewContext(createViewContext('monthly', viewContext.selectedSemesterIndex));
    } else if (level === 2 && viewContext.selectedSemesterIndex !== undefined && viewContext.selectedMonthIndex !== undefined) {
      // Back to weekly view for selected month
      setViewContext(createViewContext('weekly', viewContext.selectedSemesterIndex, viewContext.selectedMonthIndex));
    }
  };

  // Calculate chart display properties
  const maxSubmissions = Math.max(...currentData.map(d => d.submissions));
  const maxEvaluations = Math.max(...currentData.map(d => d.evaluations));
  const maxValue = activeView === 'submissions' ? maxSubmissions : maxEvaluations;

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  const getBarColor = () => {
    return activeView === 'submissions' 
      ? 'from-blue-300 to-blue-600' 
      : 'from-purple-300 to-purple-600';
  };

  const getActiveData = (item: ProgressData) => {
    return activeView === 'submissions' ? item.submissions : item.evaluations;
  };

  // Get chart subtitle
  const getChartSubtitle = () => {
    const viewText = activeView === "submissions" ? "Assignment Submissions" : "Peer Evaluations";
    const semesterText = SEMESTER_CONFIG[currentSemesterIndex].name;
    const levelText = viewContext.level === 'daily' ? 'Daily' : 
                     viewContext.level === 'weekly' ? 'Weekly' : 'Monthly';
    return `${viewText} - ${semesterText} (${levelText} View)`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        {/* Header with navigation */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BarChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {getChartSubtitle()}
              {currentSemesterIndex === 1 && (
                <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                  (Data up to {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
                </span>
              )}
              <button
                onClick={refreshData}
                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title={`Refresh data (Last updated: ${lastDataUpdate})`}
              >
                <RefreshIcon className="w-3 h-3 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" />
              </button>
            </p>
          </div>
        </div>
        
        {/* View toggle and Semester toggle */}
        <div className="flex items-center space-x-3">
          {/* Semester Toggle - always visible for filtering data */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => {
                setCurrentSemesterIndex(0);
                // Reset to monthly view when switching semesters
                setViewContext(createViewContext('monthly', 0));
              }}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                currentSemesterIndex === 0
                  ? "bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Dec-Apr
            </button>
            <button
              onClick={() => {
                setCurrentSemesterIndex(1);
                // Reset to monthly view when switching semesters  
                setViewContext(createViewContext('monthly', 1));
              }}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                currentSemesterIndex === 1
                  ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Jul-Nov
            </button>
          </div>
          
          {/* Data View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveView("submissions")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                activeView === "submissions"
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setActiveView("evaluations")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                activeView === "evaluations"
                  ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Evaluations
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <nav className="flex items-center space-x-2 text-sm">
          {viewContext.breadcrumb.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              )}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`font-medium transition-colors ${
                  index === viewContext.breadcrumb.length - 1
                    ? 'text-blue-600 dark:text-blue-400 cursor-default'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                disabled={index === viewContext.breadcrumb.length - 1}
              >
                {crumb}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <TrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Total {activeView}
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {activeView === "submissions" ? analytics.totalSubmissions : analytics.totalEvaluations}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <BarChartIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Average
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {analytics.averageDaily}
          </p>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 sm:h-48 px-1 sm:px-2">
          {currentData.map((item, index) => {
            const value = getActiveData(item);
            const height = getBarHeight(value);
            const isClickable = viewContext.level !== 'daily';

            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-1 sm:space-y-2 flex-1"
              >
                <div className="relative w-full max-w-8 sm:max-w-12 h-28 sm:h-40 flex items-end">
                  <div
                    className={`w-full bg-gradient-to-t ${getBarColor()} rounded-t-lg transition-all duration-1000 ease-out relative group ${
                      isClickable ? 'cursor-pointer hover:opacity-80 hover:scale-105' : 'cursor-default'
                    }`}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                    onClick={() => isClickable && handleBarClick(item)}
                  >
                    {/* Value label */}
                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-1 sm:px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {value}
                    </div>
                    
                    {/* Click indicator for drillable items */}
                    {isClickable && (
                      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ChevronRightIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-center">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Instruction text */}
        {viewContext.level !== 'daily' && (
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click on bars to drill down into {viewContext.level === 'monthly' ? 'weekly' : 'daily'} data
            </p>
          </div>
        )}
      </div>

      {/* Analytics Insights */}
      {insights.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            📊 Analytics Insights
          </h4>
          <div className="space-y-2">
            {insights.slice(0, 2).map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2"
              >
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Growth</div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-300">
                {analytics.growthRate > 0 ? '+' : ''}{analytics.growthRate}%
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Efficiency</div>
              <div className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                {analytics.efficiency}%
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Best Period</div>
              <div className="text-sm font-bold text-purple-900 dark:text-purple-300">
                {analytics.bestDay}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-r ${getBarColor()}`}
          ></div>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {activeView === "submissions" ? "Submissions" : "Evaluations"} - {viewContext.title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
