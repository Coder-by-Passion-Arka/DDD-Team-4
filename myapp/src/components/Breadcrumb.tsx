import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Trophy, Flame } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import FloatingChatbot from './FloatingChatbot';
import LeaderboardPanel from './LeaderboardPanel';

const Breadcrumb: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const navigate = useNavigate();
  
  // Current user's streak - this could come from props or context in a real app
  const currentStreak = 12;

  const handleStreakClick = () => {
    // Navigate to dashboard and scroll to streak section
    navigate('/dashboard');
    
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const streakElement = document.getElementById('streak-section');
      if (streakElement) {
        streakElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
        
        // Add a brief highlight effect
        streakElement.classList.add('ring-4', 'ring-orange-300', 'ring-opacity-50');
        setTimeout(() => {
          streakElement.classList.remove('ring-4', 'ring-orange-300', 'ring-opacity-50');
        }, 2000);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-all duration-500">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="absolute top-6 right-6 z-10 flex items-center space-x-3">
          {/* Streak Counter - Now Clickable */}
          <button
            onClick={handleStreakClick}
            className="relative p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            aria-label="View streak details"
          >
            <div className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-200" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{currentStreak}</span>
            </div>
            
            {/* Streak tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {currentStreak} day streak - Click to view details
            </div>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="relative p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
            aria-label="View leaderboard"
          >
            <Trophy className="w-6 h-6 text-amber-500 group-hover:text-amber-600 transition-colors duration-200" />
            
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">!</span>
            </div>

            {/* Leaderboard tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              View leaderboard
            </div>
          </button>
          
          <ThemeToggle />
        </div>
        
        <main className="p-8 pt-20">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <FloatingChatbot />
      <LeaderboardPanel 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
      />
    </div>
  );
};

export default Breadcrumb;