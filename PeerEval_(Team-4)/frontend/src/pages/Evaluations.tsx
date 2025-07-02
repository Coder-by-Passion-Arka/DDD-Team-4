// codebase
// import React from 'react';
// import { motion } from 'framer-motion';
// import {BookOpenCheck  } from "lucide-react";

// const evaluations = [
//   { subject: 'Mathematics', score: 92, grade: 'A+', feedback: 'Excellent problem-solving skills.' },
//   { subject: 'Physics', score: 85, grade: 'A', feedback: 'Very good understanding of concepts.' },
//   { subject: 'English', score: 78, grade: 'B+', feedback: 'Good writing skills but improve grammar.' },
// ];

// const Evaluation: React.FC = () => {
//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-purple-600 dark:to-slate-800 min-h-screen rounded-xl">
//       {/* Header */}
//       <div className="mb-6 sm:mb-8 lg:mb-10">
//         <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-indigo-800 dark:text-blue-300 mb-2 sm:mb-3">
//           <BookOpenCheck  className="w-6 h-6 sm:w-7 sm:h-7 inline-block mr-2"/> Evaluation Report
//         </div>
//         <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
//           Review your academic performance and feedback
//         </p>
//       </div>
//       {/* Performance Cards */}
//       <div className="grid gap-4 sm:gap-6 max-w-5xl mx-auto">
//         {evaluations.map((evaluation, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.2 }}
//             className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border-l-4 border-indigo-500 dark:border-white hover:shadow-xl transition ease-in-out delay-150 duration-300 dark:bg-indigo-100/30 hover:border-slate-500/30 dark:hover:shadow-lg dark:hover:shadow-gray-900/50"
//           >
//             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
//               <div className="flex-1">
//                 <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2">
//                   {evaluation.subject}
//                 </h2>
//                 <div className="space-y-1 sm:space-y-2">
//                   <p className="text-sm sm:text-base text-gray-600 dark:text-white">
//                     Grade:{" "}
//                     <span className="font-semibold text-lg">
//                       {evaluation.grade}
//                     </span>
//                   </p>
//                   <p className="text-sm sm:text-base text-gray-600 dark:text-white">
//                     Score:{" "}
//                     <span className="font-semibold text-lg">
//                       {evaluation.score}/100
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               {/* Score Circle */}
//               <div className="flex-shrink-0 self-center sm:self-start">
//                 <div className="relative w-16 h-16 sm:w-20 sm:h-20">
//                   <svg
//                     className="w-full h-full transform -rotate-90"
//                     viewBox="0 0 36 36"
//                   >
//                     <path
//                       className="text-gray-200 dark:text-gray-600"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       fill="none"
//                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                     />
//                     <path
//                       className="text-indigo-500"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeDasharray={`${evaluation.score}, 100`}
//                       strokeLinecap="round"
//                       fill="none"
//                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                     />
//                   </svg>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">
//                       {evaluation.score}%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
//               <p className="text-sm sm:text-base text-gray-700 italic dark:text-white">
//                 <span className="font-medium">Feedback:</span> "
//                 {evaluation.feedback}"
//               </p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Evaluation;

// ============================= // 

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Evaluation {
  id: string;
  subject: string;
  score: number;
  grade: string;
  feedback: string;
  evaluatedBy?: string;
  evaluatedAt?: string;
  assignmentTitle?: string;
  maxScore?: number;
}

const Evaluation: React.FC = () => {
  const { state } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!state.user) return;

      try {
        setIsLoading(true);

        // For now, we'll use empty array since backend endpoints might not exist yet
        // In production, replace this with actual API calls
        const mockEvaluations: Evaluation[] = [];

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // TODO: Replace with actual API call when backend endpoint is ready
        /*
        const response = await apiService.get('/user/evaluations');
        const actualEvaluations: Evaluation[] = response.data;
        */

        setEvaluations(mockEvaluations);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
        setError("Failed to load evaluations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, [state.user]);

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-purple-600 dark:to-slate-800 min-h-screen rounded-xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-indigo-800 dark:text-blue-300 mb-2 sm:mb-3">
          <BookOpenCheck className="w-6 h-6 sm:w-7 sm:h-7 inline-block mr-2" />{" "}
          Evaluation Report
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
          Review your academic performance and feedback
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Performance Cards */}
      <div className="grid gap-4 sm:gap-6 max-w-5xl mx-auto">
        {evaluations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <BookOpenCheck className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Evaluations Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't received any evaluations yet. Complete assignments and
              peer evaluations to start building your academic record.
            </p>

            {/* User guidance based on role */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                How to Get Evaluations
              </h4>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <p className="text-gray-600 dark:text-gray-300">
                    Complete assignments given by your instructors
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <p className="text-gray-600 dark:text-gray-300">
                    Participate in peer evaluation sessions
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <p className="text-gray-600 dark:text-gray-300">
                    Submit your work for review by peers and instructors
                  </p>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => (window.location.href = "/assignments")}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Assignments
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          evaluations.map((evaluation, idx) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border-l-4 border-indigo-500 dark:border-white hover:shadow-xl transition ease-in-out delay-150 duration-300 dark:bg-indigo-100/30 hover:border-slate-500/30 dark:hover:shadow-lg dark:hover:shadow-gray-900/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    {evaluation.subject}
                  </h2>
                  {evaluation.assignmentTitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Assignment: {evaluation.assignmentTitle}
                    </p>
                  )}
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-white">
                      Grade:{" "}
                      <span className="font-semibold text-lg">
                        {evaluation.grade}
                      </span>
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-white">
                      Score:{" "}
                      <span className="font-semibold text-lg">
                        {evaluation.score}/{evaluation.maxScore || 100}
                      </span>
                    </p>
                    {evaluation.evaluatedBy && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Evaluated by: {evaluation.evaluatedBy}
                      </p>
                    )}
                    {evaluation.evaluatedAt && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Date:{" "}
                        {new Date(evaluation.evaluatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Score Circle */}
                <div className="flex-shrink-0 self-center sm:self-start">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-200 dark:text-gray-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${evaluation.score}, ${
                          evaluation.maxScore || 100
                        }`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">
                        {evaluation.score}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                <p className="text-sm sm:text-base text-gray-700 italic dark:text-white">
                  <span className="font-medium">Feedback:</span> "
                  {evaluation.feedback}"
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Statistics */}
      {evaluations.length > 0 && (
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Performance Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-purple-200 dark:border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-amber-400 mb-2">
                {evaluations.length}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-white">
                Total Evaluations
              </div>
            </div>
            <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-purple-200 dark:border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-amber-400 mb-2">
                {evaluations.length > 0
                  ? (
                      evaluations.reduce((acc, evaluation) => acc + evaluation.score, 0) /
                      evaluations.length
                    ).toFixed(1)
                  : "0"}
                %
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-white">
                Average Score
              </div>
            </div>
            <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-purple-200 dark:border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-amber-400 mb-2">
                {evaluations.length > 0
                  ? Math.max(...evaluations.map((evaluation) => evaluation.score))
                  : "0"}
                %
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-white">
                Highest Score
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluation;