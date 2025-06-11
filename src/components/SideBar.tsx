import { Link, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, Target, Settings, User, Home, Award, Clock, Bot } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Assignments', path: '/assignments' },
    { icon: Target, label: 'Evaluations', path: '/evaluations' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Award, label: 'Achievements', path: '/achievements' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Bot, label: 'Chatbot', path: '/chatbot' }, // ✅ New Chatbot item
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-10">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">EvalPeer</h2>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={index}>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
          <Clock className="w-8 h-8 mb-2" />
          <h3 className="font-semibold mb-1">Stay Consistent</h3>
          <p className="text-sm opacity-90">Keep evaluating daily to maintain your streak!</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
