import React from "react";

const AdminUserManagement: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 flex flex-col items-center">
    <div className="max-w-3xl w-full">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-red-700 dark:text-white mb-2 drop-shadow-lg">Admin User Management</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Manage platform users, roles, and permissions.</p>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-900 p-6">
        <table className="min-w-full divide-y divide-red-200 dark:divide-gray-700">
          <thead className="bg-red-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-red-100 dark:divide-gray-800">
            {/* Dummy users */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Admin User</td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">admin@example.com</td>
              <td className="px-6 py-4 text-purple-700 dark:text-purple-300">Admin</td>
              <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-green-100 text-green-800">Active</span></td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Teacher User</td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">teacher@example.com</td>
              <td className="px-6 py-4 text-blue-700 dark:text-blue-300">Teacher</td>
              <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-green-100 text-green-800">Active</span></td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Student User</td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">student@example.com</td>
              <td className="px-6 py-4 text-green-700 dark:text-green-300">Student</td>
              <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-red-100 text-red-800">Inactive</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminUserManagement;
