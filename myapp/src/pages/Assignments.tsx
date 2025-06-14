import React, { useState } from 'react';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  date: string;
}

const AssignmentPage: React.FC = () => {
  const [submittedAssignments, setSubmittedAssignments] = useState<Assignment[]>([
    { id: 1,
      title: 'Math Homework 1',
      subject: 'Mathematics', date: '2025-06-10' 
    },
    { id: 2,
      title: 'Essay on Climate Change', 
      subject: 'English', 
      date: '2025-06-09' 
    },
  ]);

  const [checkedAssignments, setCheckedAssignments] = useState<Assignment[]>([
    { id: 3, title: 'Physics Lab Report', subject: 'Physics', date: '2025-06-05' },
  ]);

  const handleMarkAsChecked = (assignment: Assignment) => {
    setSubmittedAssignments(prev => prev.filter(item => item.id !== assignment.id));
    setCheckedAssignments(prev => [...prev, assignment]);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border-2 dark:border-gray-500/20 rounded-xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3 text-center">
          📚 Assignments Dashboard
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
          Manage your submitted and reviewed assignments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Submitted Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md dark:bg-gray-800 border-2 dark:border-gray-500/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">
            📩 Assignments Submitted by You
          </h2>
          {submittedAssignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No submitted assignments.
              </p>
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {submittedAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 border rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:dark:bg-gray-700/90 transition duration-200 space-y-3 sm:space-y-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white text-sm sm:text-base">
                      {assignment.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {assignment.subject} — {assignment.date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkAsChecked(assignment)}
                    className="bg-blue-500 px-3 py-2 rounded hover:bg-blue-600 text-sm text-white transition-colors duration-200 w-full sm:w-auto"
                  >
                    Mark as Checked
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Checked Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md dark:bg-gray-800 border-2 dark:border-gray-500/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">
            ✅ Assignments You Checked
          </h2>
          {checkedAssignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No checked assignments.
              </p>
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {checkedAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 border rounded-lg bg-green-50 dark:bg-green-900/30 dark:border-green-500/50 space-y-2 sm:space-y-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white text-sm sm:text-base">
                      {assignment.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {assignment.subject} — {assignment.date}
                    </p>
                  </div>
                  <span className="text-green-700 font-semibold text-sm dark:text-green-300 text-center sm:text-right">
                    Checked
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;