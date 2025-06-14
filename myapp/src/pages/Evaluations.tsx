import React from 'react';
import { motion } from 'framer-motion';

const evaluations = [
  { subject: 'Mathematics', score: 92, grade: 'A+', feedback: 'Excellent problem-solving skills.' },
  { subject: 'Physics', score: 85, grade: 'A', feedback: 'Very good understanding of concepts.' },
  { subject: 'English', score: 78, grade: 'B+', feedback: 'Good writing skills but improve grammar.' },
];

const Evaluation: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-purple-600 dark:to-slate-800 min-h-screen rounded-xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-indigo-800 dark:text-blue-300 mb-2 sm:mb-3">
          📊 Evaluation Report
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
          Review your academic performance and feedback
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 max-w-5xl mx-auto">
        {evaluations.map((evaluation, idx) => (
          <motion.div
            key={idx}
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
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-white">
                    Grade: <span className="font-semibold text-lg">{evaluation.grade}</span>
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-white">
                    Score: <span className="font-semibold text-lg">{evaluation.score}/100</span>
                  </p>
                </div>
              </div>
              
              {/* Score Circle */}
              <div className="flex-shrink-0 self-center sm:self-start">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
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
                      strokeDasharray={`${evaluation.score}, 100`}
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
                <span className="font-medium">Feedback:</span> "{evaluation.feedback}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Evaluation;