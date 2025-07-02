import React from 'react';
import { BookOpen, ClipboardList, CheckCircle2, UserCircle2, CalendarDays } from 'lucide-react';

const courses = [
  {
    title: 'Data Structures',
    assignments: 6,
    completedBy: 20,
    totalStudents: 25,
    instructor: 'Prof. Nisha Verma',
    averageScore: 86,
    status: 'Active',
    startDate: 'Jan 10, 2025',
    endDate: 'May 25, 2025',
  },
  {
    title: 'Operating Systems',
    assignments: 5,
    completedBy: 18,
    totalStudents: 30,
    instructor: 'Dr. Rajat Kulkarni',
    averageScore: 78,
    status: 'Active',
    startDate: 'Feb 1, 2025',
    endDate: 'June 1, 2025',
  },
  {
    title: 'Software Engineering',
    assignments: 4,
    completedBy: 15,
    totalStudents: 20,
    instructor: 'Dr. Seema Rao',
    averageScore: 91,
    status: 'Completed',
    startDate: 'Oct 15, 2024',
    endDate: 'Feb 20, 2025',
  },
];

const CoursesPage = () => {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, idx) => {
          const percent = Math.round((course.completedBy / course.totalStudents) * 100);
          const statusColor =
            course.status === 'Active'
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400';

          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Assignments: {course.assignments}</p>
                </div>
              </div>

              {/* Instructor and Date */}
              <div className="flex items-center space-x-2 mb-1 text-sm text-gray-600 dark:text-gray-300">
                <UserCircle2 className="w-4 h-4 text-blue-500" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600 dark:text-gray-300">
                <CalendarDays className="w-4 h-4 text-purple-500" />
                <span>{course.startDate} → {course.endDate}</span>
              </div>

              {/* Completion Progress */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>{course.completedBy} / {course.totalStudents} Students Completed</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Stats Row */}
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Avg Score: {course.averageScore}%
                </span>
                <span className={`font-medium ${statusColor}`}>{course.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesPage;
