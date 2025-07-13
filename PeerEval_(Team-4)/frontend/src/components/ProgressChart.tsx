import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ProgressData {
  day: string;
  submissions: number;
  evaluations: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const [activeView, setActiveView] = useState<'submissions' | 'evaluations'>('submissions');
  
  const maxSubmissions = Math.max(...data.map(d => d.submissions));
  const maxEvaluations = Math.max(...data.map(d => d.evaluations));
  const maxValue = activeView === 'submissions' ? maxSubmissions : maxEvaluations;

  const totalSubmissions = data.reduce((sum, d) => sum + d.submissions, 0);
  const totalEvaluations = data.reduce((sum, d) => sum + d.evaluations, 0);

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  const getBarColor = () => {
    return activeView === 'submissions' 
      ? 'from-blue-500 to-blue-600' 
      : 'from-purple-500 to-purple-600';
  };

  const getActiveData = (item: ProgressData) => {
    return activeView === 'submissions' ? item.submissions : item.evaluations;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 animate-fadeInUp dashboard-card-hover">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 animate-fadeInLeft">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-scaleIn dashboard-enter">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white animate-fadeInUp">Weekly Progress</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 animate-fadeInUp animate-stagger-1">
              {activeView === 'submissions' ? 'Assignment Submissions' : 'Peer Evaluations'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 animate-fadeInRight">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveView('submissions')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-300 dashboard-button-hover ${
                activeView === 'submissions'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm transform scale-105 animate-scaleIn'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setActiveView('evaluations')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-300 dashboard-button-hover ${
                activeView === 'evaluations'
                  ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm transform scale-105 animate-scaleIn'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Evaluations
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4 animate-fadeInUp dashboard-stagger-1 dashboard-card-hover">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 animate-gentle-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total {activeView}</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 animate-fadeInUp animate-stagger-1">
            {activeView === 'submissions' ? totalSubmissions : totalEvaluations}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4 animate-fadeInUp dashboard-stagger-2 dashboard-card-hover">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 animate-gentle-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Daily Average</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 animate-fadeInUp animate-stagger-1">
            {Math.round((activeView === 'submissions' ? totalSubmissions : totalEvaluations) / 7)}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 sm:h-48 px-1 sm:px-2">
          {data.map((item, index) => {
            const value = getActiveData(item);
            const height = getBarHeight(value);
            
            return (
              <div key={item.day} className={`flex flex-col items-center space-y-1 sm:space-y-2 flex-1 animate-fadeInUp dashboard-stagger-${index + 1}`}>
                <div className="relative w-full max-w-8 sm:max-w-12 h-28 sm:h-40 flex items-end">
                  <div 
                    className={`w-full bg-gradient-to-t ${getBarColor()} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer relative group dashboard-card-hover`}
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Value label on hover */}
                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-1 sm:px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 animate-scaleIn">
                      {value}
                    </div>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 animate-fadeInUp animate-stagger-1">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700 animate-fadeInUp">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getBarColor()} animate-gentle-pulse`}></div>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {activeView === 'submissions' ? 'Submissions' : 'Evaluations'} this week
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;