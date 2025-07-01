// StudentsPage.tsx
import React from 'react';
import { User2, ClipboardCheck, CheckCircle2, Clock4 } from 'lucide-react';

const students = [
  { name: 'Aditi Sharma', email: 'aditi@example.com', completed: 4, total: 6 },
  { name: 'Ravi Mehta', email: 'ravi@example.com', completed: 3, total: 5 },
  { name: 'Kiran Patel', email: 'kiran@example.com', completed: 6, total: 6 },
];

const StudentsPage = () => {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student, idx) => {
          const remaining = student.total - student.completed;
          const completionPercent = Math.round((student.completed / student.total) * 100);

          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  <User2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Completed</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{student.completed}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock4 className="w-4 h-4 text-orange-400" />
                    <span>Remaining</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{remaining}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Progress: {completionPercent}%
                </p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: ${completionPercent}% }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentsPage;
