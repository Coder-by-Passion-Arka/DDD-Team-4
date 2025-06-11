import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  assignments: 'Assignments',
  evaluations: 'Evaluations',
  analytics: 'Analytics',
  achievements: 'Achievements',
  profile: 'Profile',
  settings: 'Settings',
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="md:hidden flex items-center px-4 py-2 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 text-sm font-medium sticky top-0 z-20">
      <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">Home</Link>
      {paths.map((segment, idx) => {
        const path = '/' + paths.slice(0, idx + 1).join('/');
        return (
          <span key={path} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            {idx === paths.length - 1 ? (
              <span className="text-gray-900 dark:text-white">{labelMap[segment] || segment}</span>
            ) : (
              <Link to={path} className="text-blue-600 dark:text-blue-400 hover:underline">{labelMap[segment] || segment}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
