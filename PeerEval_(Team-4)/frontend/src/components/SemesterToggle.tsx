// Semester Toggle Component - Shows current semester and allows switching
// Provides global semester context information

import React from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { SEMESTER_CONFIG } from '../utils/analyticsUtils';

// Calendar icon component
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Switch icon component  
const SwitchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

interface SemesterToggleProps {
  showFullToggle?: boolean; // Whether to show full toggle buttons or just info
  className?: string;
}

const SemesterToggle: React.FC<SemesterToggleProps> = ({ 
  showFullToggle = false, 
  className = "" 
}) => {
  const { currentSemesterIndex, setCurrentSemesterIndex } = useAnalytics();
  
  const currentSemester = SEMESTER_CONFIG[currentSemesterIndex];
  const otherSemesterIndex = currentSemesterIndex === 0 ? 1 : 0;
  const otherSemester = SEMESTER_CONFIG[otherSemesterIndex];

  if (showFullToggle) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Academic Period
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Switch between semesters
              </p>
            </div>
          </div>
          <SwitchIcon className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Previous Semester */}
          <button
            onClick={() => setCurrentSemesterIndex(0)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              currentSemesterIndex === 0
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="text-left">
              <div className={`text-xs font-medium ${
                currentSemesterIndex === 0 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Previous
              </div>
              <div className={`text-sm font-semibold ${
                currentSemesterIndex === 0 
                  ? 'text-orange-900 dark:text-orange-100' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                Dec - Apr
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {SEMESTER_CONFIG[0].months.slice(0, 3).map((month, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      currentSemesterIndex === 0 
                        ? 'bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {month.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          </button>

          {/* Current Semester */}
          <button
            onClick={() => setCurrentSemesterIndex(1)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              currentSemesterIndex === 1
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="text-left">
              <div className={`text-xs font-medium ${
                currentSemesterIndex === 1 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Current
              </div>
              <div className={`text-sm font-semibold ${
                currentSemesterIndex === 1 
                  ? 'text-green-900 dark:text-green-100' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                Jul - Nov
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {SEMESTER_CONFIG[1].months.slice(0, 3).map((month, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      currentSemesterIndex === 1 
                        ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {month.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          </button>
        </div>
        
        {/* Active indicator */}
        <div className="mt-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Active Period:
            </span>
            <span className={`text-xs font-medium ${
              currentSemesterIndex === 1 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {currentSemester.name}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Compact info display
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <CalendarIcon className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {currentSemester.name}
      </span>
      <button
        onClick={() => setCurrentSemesterIndex(otherSemesterIndex)}
        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
      >
        Switch to {otherSemester.name.split(' ')[0]}
      </button>
    </div>
  );
};

export default SemesterToggle;
