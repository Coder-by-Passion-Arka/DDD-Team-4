import React from 'react';
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ProgressChart from '../components/ProgressChart';
import StreakCounter from '../components/StreakCounter';
import RecentAssignments from '../components/RecentAssignments';
import BadgesSection from '../components/BadgesSection';
import DailyGoals from '../components/DailyGoals';

import { mockUserBadges, calculateTotalTrailTokens } from '../data/badgesData';

const Dashboard: React.FC = () => {
  const stats = {
    submitted: 24,
    inProgress: 3,
    toEvaluate: 7,
    completed: 180,
  };

  const dailyProgress = [
    { day: 'Mon', submissions: 4, evaluations: 2 },
    { day: 'Tue', submissions: 6, evaluations: 3 },
    { day: 'Wed', submissions: 3, evaluations: 5 },
    { day: 'Thu', submissions: 8, evaluations: 4 },
    { day: 'Fri', submissions: 5, evaluations: 6 },
    { day: 'Sat', submissions: 2, evaluations: 1 },
    { day: 'Sun', submissions: 3, evaluations: 2 },
  ];

  const totalTrailTokens = calculateTotalTrailTokens(mockUserBadges);

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
          Evaluation Dashboard
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
          Track your peer evaluation progress and assignments with real-time insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Submitted"
          value={stats.submitted}
          icon={CheckCircle}
          color="emerald"
          trend="+12%"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="amber"
          trend="-5%"
        />
        <StatsCard
          title="To Evaluate"
          value={stats.toEvaluate}
          icon={Target}
          color="blue"
          trend="+8%"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={BookOpen}
          color="purple"
          trend="+23%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <ProgressChart data={dailyProgress} />
        </div>
        <div id="streak-section" className="transition-all duration-300 rounded-2xl">
          <StreakCounter currentStreak={12} bestStreak={28} />
        </div>
      </div>
      <div className="mb-6 sm:mb-8">
        <DailyGoals />
      </div>

      {/* Badges Section */}
      <div className="mb-6 sm:mb-8">
        <BadgesSection 
          userBadges={mockUserBadges} 
          totalTrailTokens={totalTrailTokens}
        />
      </div>

      <RecentAssignments />
    </>
  );
};

export default Dashboard;