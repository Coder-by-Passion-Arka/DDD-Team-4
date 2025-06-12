import React, { useState } from 'react';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  date: string;
}

const AssignmentPage: React.FC = () => {
  const [submittedAssignments, setSubmittedAssignments] = useState<Assignment[]>([
    { id: 1, title: 'Math Homework 1', subject: 'Mathematics', date: '2025-06-10' },
    { id: 2, title: 'Essay on Climate Change', subject: 'English', date: '2025-06-09' },
  ]);

  const [checkedAssignments, setCheckedAssignments] = useState<Assignment[]>([
    { id: 3, title: 'Physics Lab Report', subject: 'Physics', date: '2025-06-05' },
  ]);

  const handleMarkAsChecked = (assignment: Assignment) => {
    setSubmittedAssignments(prev => prev.filter(item => item.id !== assignment.id));
    setCheckedAssignments(prev => [...prev, assignment]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">📚 Assignments Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submitted Section */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">📩 Assignments Submitted by You</h2>
          {submittedAssignments.length === 0 ? (
            <p className="text-gray-500">No submitted assignments.</p>
          ) : (
            <ul className="space-y-3">
              {submittedAssignments.map(assignment => (
                <li
                  key={assignment.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.subject} — {assignment.date}</p>
                  </div>
                  <button
                    onClick={() => handleMarkAsChecked(assignment)}
                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Mark as Checked
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Checked Section */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">✅ Assignments You Checked</h2>
          {checkedAssignments.length === 0 ? (
            <p className="text-gray-500">No checked assignments.</p>
          ) : (
            <ul className="space-y-3">
              {checkedAssignments.map(assignment => (
                <li
                  key={assignment.id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-green-50"
                >
                  <div>
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.subject} — {assignment.date}</p>
                  </div>
                  <span className="text-green-700 font-semibold text-sm">Checked</span>
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