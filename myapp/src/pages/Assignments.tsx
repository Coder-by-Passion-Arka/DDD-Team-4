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
    <div
      className="p-6 bg-gray-100 min-h-screen
      m-[0.5rem] bg-gradient-to-br dark:from-gray-900 dark:to-gray-800
      border-radius-xl
      border-2 dark:border-gray-500/20
    rounded-xl"
    >
      <h1
        className="text-3xl font-bold text-center mb-6 display-flex
      dark:text-white"
      >
        📚 Assignments Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submitted Section */}
        <div
          className="bg-white p-4 rounded-xl shadow-md
        dark:bg-gray-800
        border-2 dark:border-gray-500/20"
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            📩 Assignments Submitted by You
          </h2>
          {submittedAssignments.length === 0 ? (
            <p className="text-gray-500 dark:text-white">
              No submitted assignments.
            </p>
          ) : (
            <ul className="space-y-3">
              {submittedAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 
                  dark:bg-gray-700
                  dark:border-gray-600
                  hover:dark:bg-gray-700/90
                  ease-in-out delay-150 duration-200
                  transition"
                >
                  <div>
                    <h3 className="font-medium dark:text-white">
                      {assignment.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600
                    dark:text-white"
                    >
                      {assignment.subject} — {assignment.date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkAsChecked(assignment)}
                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm
                    text-white
                    m-[0.1rem]
                    "
                  >
                    Mark as Checked
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Checked Section */}
        <div
          className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800
        border-2 dark:border-gray-500/20"
        >
          <h2 className="text-xl font-semibold mb-4 dark:text-white ">
            ✅ Assignments You Checked
          </h2>
          {checkedAssignments.length === 0 ? (
            <p className="text-gray-500
            dark:text-white bg-white hover:bg-gray-300
            dark:bg-gray-700 border-2 border-gray-500/50">No checked assignments.</p>
          ) : (
            <ul className="space-y-3">
              {checkedAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-green-50
                  dark:bg-green-900
                  dark:border-green-500 opacity-90"
                >
                  <div>
                    <h3 className="font-medium dark:text-white">
                      {assignment.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600
                    dark:text-white"
                    >
                      {assignment.subject} — {assignment.date}
                    </p>
                  </div>
                  <span className="text-green-700 font-semibold text-sm dark:text-white">
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
