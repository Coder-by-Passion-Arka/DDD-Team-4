// import React from 'react';
// // import {Router} from  'react-router-dom';
// import { NavLink, useLocation } from 'react-router-dom';
// import { BarChart3, BookOpen, Target, Settings, User, Home, Award, Clock, Bot} from 'lucide-react';

// const menuItems = [
//   { icon: Home, label: "Dashboard", path: "/dashboard" },
//   { icon: BookOpen, label: "Assignments", path: "/assignments" },
//   { icon: Target, label: "Evaluations", path: "/evaluations" },
//   { icon: BarChart3, label: "Analytics", path: "/analytics" },
//   { icon: Award, label: "Achievements", path: "/achievements" },
//   { icon: User, label: "Profile", path: "/profile" },
//   { icon: Settings, label: "Settings", path: "/settings" },
//   { icon: Bot, label: "Chatbot", path: "/chatbot" },
// ];

// const Sidebar: React.FC = () => {
//   const location = useLocation();

//   return (
//     <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-lg z-10 transition-colors duration-500 ease-in-out">
//       <div className="p-6">
//         <div className="flex items-center space-x-3 mb-8">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
//             <Target className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="font-bold text-gray-900 dark:text-white">EvalPeer</h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
//           </div>
//         </div>

//         <nav className="space-y-[2px] m-0.5">
//           {menuItems.map((item, index) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <NavLink
//                 to={item.path}
//                 key={index}
//                 className={({ isActive }) =>
//                   `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 no-underline ` +
//                   (isActive
//                     ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500 dark:border-blue-400'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white')
//                 }
//               >
//                 <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-300' : ''}`} />
//                 <span className="font-medium">{item.label}</span>
//               </NavLink>
//             );
//           })}
//         </nav>
//       </div>
//       TODO: Add motivational quote 
//       {/* <div className="absolute bottom-0 left-0 right-0 p-6">
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
//           <Clock className="w-8 h-8 mb-2" />
//           <h3 className="font-semibold mb-1">Stay Consistent</h3>
//           <p className="text-sm opacity-90">Keep evaluating daily to maintain your streak!</p>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default Sidebar;

// src/components/SideBar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, Target, Settings, User, Home, Award, Clock, Bot, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Assignments", path: "/assignments" },
  { icon: Target, label: "Evaluations", path: "/evaluations" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Award, label: "Achievements", path: "/achievements" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Bot, label: "Chatbot", path: "/chatbot" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-lg z-10 transition-colors duration-500 ease-in-out">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">EvalPeer</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <nav className="space-y-[2px] m-0.5">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                to={item.path}
                key={index}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 no-underline ` +
                  (isActive
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white')
                }
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-300' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
