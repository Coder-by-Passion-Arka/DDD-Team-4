import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  FileText,
  ArrowRight 
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  peersCount: number;
  submissionsReceived: number;
}

const RecentAssignments: React.FC = () => {
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Data Structures Implementation',
      course: 'CS 301',
      dueDate: '2024-01-15',
      status: 'pending',
      peersCount: 5,
      submissionsReceived: 3
    },
    {
      id: '2',
      title: 'UI/UX Design Analysis',
      course: 'DES 205',
      dueDate: '2024-01-12',
      status: 'in-progress',
      peersCount: 4,
      submissionsReceived: 4
    },
    {
      id: '3',
      title: 'Machine Learning Project',
      course: 'CS 401',
      dueDate: '2024-01-10',
      status: 'completed',
      peersCount: 6,
      submissionsReceived: 6
    },
    {
      id: '4',
      title: 'Database Design Review',
      course: 'CS 350',
      dueDate: '2024-01-08',
      status: 'overdue',
      peersCount: 3,
      submissionsReceived: 2
    }
  ];

  const getStatusConfig = (status: Assignment['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          label: 'Completed'
        };
      case 'in-progress':
        return {
          icon: Clock,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          label: 'In Progress'
        };
      case 'overdue':
        return {
          icon: AlertCircle,
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          label: 'Overdue'
        };
      default:
        return {
          icon: FileText,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          label: 'Pending'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Assignments</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Peer evaluation tasks</p>
          </div>
        </div>
        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-xs sm:text-sm flex items-center space-x-1 hover:space-x-2 transition-all duration-200">
          <span>View all</span>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {assignments.map((assignment) => {
          const statusConfig = getStatusConfig(assignment.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div 
              key={assignment.id}
              className="p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${statusConfig.bg} ${statusConfig.border} border flex items-center justify-center mt-0.5`}>
                      <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${statusConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 text-sm sm:text-base">
                        {assignment.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{assignment.course}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{assignment.submissionsReceived}/{assignment.peersCount} peers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} ml-2`}>
                  {statusConfig.label}
                </div>
              </div>

              {assignment.submissionsReceived < assignment.peersCount && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{assignment.submissionsReceived} of {assignment.peersCount} evaluations</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${(assignment.submissionsReceived / assignment.peersCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAssignments;