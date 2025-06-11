import React from 'react';
import { Flame, Award } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ currentStreak, bestStreak }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-fit">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Flame className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Current Streak</h3>
        
        <div className="text-4xl font-bold text-orange-600 mb-1">
          {currentStreak}
        </div>
        <p className="text-gray-600 mb-6">days in a row</p>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Personal Best</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">{bestStreak} days</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress to next milestone</span>
            <span className="font-medium text-gray-900">{Math.min(currentStreak, 30)}/30</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;