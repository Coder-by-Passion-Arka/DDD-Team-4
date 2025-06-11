import React from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  status: 'completed' | 'pending' | 'overdue';
  dueDate: string;
  type: 'evaluate' | 'submit';
}

const RecentAssignments: React.FC = () => {
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'React Component Analysis',
      subject: 'Web Development',
      status: 'pending',
      dueDate: '2024-01-15',
      type: 'evaluate'
    },
    {
      id: '2',
      title: 'Database Design Project',
      subject: 'Database Systems',
      status: 'completed',
      dueDate: '2024-01-12',
      type: 'submit'
    },
    {
      id: '3',
      title: 'Algorithm Implementation',
      subject: 'Data Structures',
      status: 'overdue',
      dueDate: '2024-01-10',
      type: 'evaluate'
    },
    {
      id: '4',
      title: 'UI/UX Design Review',
      subject: 'Design Principles',
      status: 'pending',
      dueDate: '2024-01-18',
      type: 'evaluate'
    },
    {
      id: '5',
      title: 'API Documentation',
      subject: 'Software Engineering',
      status: 'completed',
      dueDate: '2024-01-08',
      type: 'submit'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getTypeBadge = (type: string) => {
    return type === 'evaluate' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Assignments</h3>
            <p className="text-gray-600">Your latest evaluation tasks</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              {getStatusIcon(assignment.status)}
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{assignment.title}</h4>
                <p className="text-sm text-gray-600">{assignment.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{assignment.dueDate}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadge(assignment.type)}`}>
                {assignment.type === 'evaluate' ? 'Evaluate' : 'Submit'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status)}`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAssignments;