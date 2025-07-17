import React from 'react';
import { useStreak } from '../contexts/StreakContext';

const StreakCounter: React.FC = () => {
  const { streakData, insights, riskLevel, isLoading } = useStreak();
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 h-full">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const { currentStreak, bestStreak, todayHasActivity, lastActiveDate } = streakData;

  // Determine flame color based on risk level
  const getFlameColor = () => {
    switch (riskLevel) {
      case 'danger':
        return 'from-red-500 to-orange-600';
      case 'warning':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-orange-500 to-red-600';
    }
  };

  // Get next milestone
  const getNextMilestone = () => {
    if (currentStreak < 7) return 7;
    if (currentStreak < 30) return 30;
    if (currentStreak < 100) return 100;
    return Math.ceil(currentStreak / 100) * 100;
  };

  const nextMilestone = getNextMilestone();
  const progressToMilestone = (currentStreak / nextMilestone) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getFlameColor()} flex items-center justify-center`}>
          <span className="text-white text-xl">🔥</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Streak</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {todayHasActivity ? 'Keep it up! 🎯' : 'Take action today! ⚡'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getFlameColor()} opacity-10`}></div>
            <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${getFlameColor()} opacity-20`}></div>
            <div className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getFlameColor()} text-white font-bold text-xl`}>
              {currentStreak}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentStreak} day{currentStreak !== 1 ? 's' : ''}
          </p>
          {!todayHasActivity && currentStreak > 0 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Complete an activity today to continue!
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 text-lg">🏆</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Streak</span>
            </div>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {bestStreak} day{bestStreak !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Last Active */}
          {lastActiveDate && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-sm">📅</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Active</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(lastActiveDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Progress to Next Milestone */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Next milestone</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {currentStreak}/{nextMilestone}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-full bg-gradient-to-r ${getFlameColor()} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(progressToMilestone, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {nextMilestone - currentStreak} more days to reach {nextMilestone}-day milestone
          </p>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">💡 Insights</h4>
            <div className="space-y-1">
              {insights.slice(0, 2).map((insight, index) => (
                <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                  {insight}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Risk Alert */}
        {riskLevel !== 'safe' && (
          <div className={`p-3 rounded-lg border ${
            riskLevel === 'danger' 
              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {riskLevel === 'danger' ? '🚨' : '⚠️'}
              </span>
              <div>
                <p className={`text-sm font-medium ${
                  riskLevel === 'danger'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {riskLevel === 'danger' ? 'Streak at Risk!' : 'Streak Warning'}
                </p>
                <p className={`text-xs ${
                  riskLevel === 'danger'
                    ? 'text-red-600 dark:text-red-300'
                    : 'text-yellow-600 dark:text-yellow-300'
                }`}>
                  {riskLevel === 'danger' 
                    ? 'Complete an activity today to save your streak!'
                    : 'Stay active to maintain your momentum!'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCounter;