// This component displays a bar chart of progress data for each day of the week in Dashboard.tsx.

import React, { useState } from 'react';
import { generateRealisticData, calculateAnalytics, generateInsights } from '../utils/analyticsUtils';

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

interface ProgressData {
  day: string;
  submissions: number;
  evaluations: number;
}

interface ProgressChartProps {
  // Props can be added here if needed in the future
}

const ProgressChart: React.FC<ProgressChartProps> = () => {
  const [activeView, setActiveView] = useState<'submissions' | 'evaluations'>('submissions');
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Function to aggregate data based on the selected time frame
  const aggregateData = (timeFrame: 'weekly' | 'monthly' | 'yearly') => {
    // Use realistic data generation for better analytics
    return generateRealisticData(timeFrame);
  };

  // Get dynamic title based on timeframe
  const getChartTitle = () => {
    switch (timeFrame) {
      case 'weekly':
        return 'Weekly Progress';
      case 'monthly':
        return 'Monthly Progress';
      case 'yearly':
        return 'Yearly Progress';
      default:
        return 'Progress Overview';
    }
  };

  // Get dynamic subtitle based on timeframe and active view
  const getChartSubtitle = () => {
    const viewText = activeView === "submissions" ? "Assignment Submissions" : "Peer Evaluations";
    switch (timeFrame) {
      case 'weekly':
        return `${viewText} this week`;
      case 'monthly':
        return `${viewText} by week`;
      case 'yearly':
        return `${viewText} by month`;
      default:
        return viewText;
    }
  };

  const aggregatedData = aggregateData(timeFrame);
  const analytics = calculateAnalytics(aggregatedData, activeView);
  const insights = generateInsights(aggregatedData, timeFrame);

  const maxSubmissions = Math.max(...aggregatedData.map(d => d.submissions));
  const maxEvaluations = Math.max(...aggregatedData.map(d => d.evaluations));
  const maxValue = activeView === 'submissions' ? maxSubmissions : maxEvaluations;

  const totalSubmissions = aggregatedData.reduce((sum, d) => sum + d.submissions, 0);
  const totalEvaluations = aggregatedData.reduce((sum, d) => sum + d.evaluations, 0);

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  const getBarColor = () => {
    return activeView === 'submissions' 
      ? 'from-blue-300 to-blue-600' 
      : 'from-purple-300 to-purple-600';
  };

  const getActiveData = (item: ProgressData) => {
    return activeView === 'submissions' ? item.submissions : item.evaluations;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        {/* TODO: */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BarChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {getChartTitle()}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {getChartSubtitle()}
            </p>
          </div>
        </div>
        
        {/* This section houses the logic to toggle between "Submissions" and "Evaluations" view */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {/* Button that toggles view to "Submissions" */}
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
            {/* Button that toggles view to "Evaluations" */}
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

          {/* This section houses the logic to toggle between "Weekly", "Monthly", and "Yearly" timeframes */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {/* Button that sets timeframe to "Weekly" */}
            <button
              onClick={() => setTimeFrame("weekly")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                timeFrame === "weekly"
                  ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Weekly
            </button>
            {/* Button that sets timeframe to "Monthly" */}
            <button
              onClick={() => setTimeFrame("monthly")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                timeFrame === "monthly"
                  ? "bg-white dark:bg-gray-600 text-yellow-600 dark:text-yellow-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            {/* Button that sets timeframe to "Yearly" */}
            <button
              onClick={() => setTimeFrame("yearly")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                timeFrame === "yearly"
                  ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
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
            {activeView === "submissions" ? totalSubmissions : totalEvaluations}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <BarChartIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Daily Average
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {Math.round(
              (activeView === "submissions"
                ? totalSubmissions
                : totalEvaluations) / 7
            )}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 sm:h-48 px-1 sm:px-2">
          {aggregatedData.map((item, index) => {
            const value = getActiveData(item);
            const height = getBarHeight(value);

            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-1 sm:space-y-2 flex-1"
              >
                <div className="relative w-full max-w-8 sm:max-w-12 h-28 sm:h-40 flex items-end">
                  <div
                    className={`w-full bg-gradient-to-t ${getBarColor()} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer relative group`}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Value label on hover */}
                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-1 sm:px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {value}
                    </div>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
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
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Best Day</div>
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
            {activeView === "submissions" ? "Submissions" : "Evaluations"} - {getChartTitle().toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;