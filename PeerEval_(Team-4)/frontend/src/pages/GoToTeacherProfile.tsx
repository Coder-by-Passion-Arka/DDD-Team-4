import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const GoToTeacherProfile: React.FC = () => {
  const { state } = useAuth();
  const [teacherId, setTeacherId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Find Teacher</h2>
          <p className="text-gray-600 dark:text-gray-300">Please log in to access this feature.</p>
        </div>
      </div>
    );
  }

  if (state.user?.userRole === "student") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300">Only teachers and admins can find teacher profiles.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!teacherId.trim()) {
      setError("Please enter a teacher ID or email");
      return;
    }
    setIsLoading(true);
    // Simulate navigation or API call
    setTimeout(() => {
      setIsLoading(false);
      setError("");
      alert(`Navigating to teacher profile: ${teacherId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Find Teacher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Teacher ID or Email"
            value={teacherId}
            onChange={e => setTeacherId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Find Teacher"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoToTeacherProfile;
