import React from "react";

const AdminSystemSettings: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 flex flex-col items-center">
    <div className="max-w-2xl w-full">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 dark:text-white mb-2 drop-shadow-lg">System Settings</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Configure platform-wide settings and preferences.</p>
      </div>
      <div className="rounded-xl shadow-lg bg-white dark:bg-gray-900 p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" defaultValue="PeerEval Platform" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Language</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
              <option>Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enable Notifications</label>
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-gray-600 dark:text-gray-400">Allow email notifications for all users</span>
          </div>
          <button type="submit" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold">Save Settings</button>
        </form>
      </div>
    </div>
  </div>
);

export default AdminSystemSettings;
