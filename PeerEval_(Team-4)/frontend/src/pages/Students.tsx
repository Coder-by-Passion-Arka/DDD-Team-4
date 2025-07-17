import React from "react";

const students = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob.smith@example.com", status: "Active" },
  { id: 3, name: "Charlie Lee", email: "charlie.lee@example.com", status: "Inactive" },
  { id: 4, name: "Diana Patel", email: "diana.patel@example.com", status: "Active" },
  { id: 5, name: "Ethan Kim", email: "ethan.kim@example.com", status: "Active" },
];

const StudentsPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 flex flex-col items-center">
    <div className="max-w-3xl w-full">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-white mb-2 drop-shadow-lg">Student Directory</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">View and manage your class roster with ease.</p>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-indigo-200 dark:divide-gray-700">
          <thead className="bg-indigo-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-indigo-100 dark:divide-gray-800">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-indigo-50 dark:hover:bg-gray-800 transition">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${student.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default StudentsPage;
