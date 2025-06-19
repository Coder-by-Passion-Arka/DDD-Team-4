import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Medal, Globe } from "lucide-react"; 

const achievements = [
  {
    title: 'Winner - AI Hackathon 2024',
    description: 'Led a 4-member team to build a chatbot that won 1st prize at national level.',
    icon: Medal
  },
  {
    title: 'Certificate of Excellence - Java',
    description: 'Achieved 98% in Oracle Certified Java Programmer Course.',
    icon: ScrollText
  },
  {
    title: ' Web Dev Star - Bootcamp 2023',
    description: 'Completed a full-stack bootcamp and built 3 live projects with MERN stack.',
    icon: Globe
  },
];

const Achievements: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-yellow-50 to-pink-100 dark:bg-gradient-to-br dark:to-pink-500 dark:from-purple-900 min-h-screen rounded-xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-pink-700 dark:text-amber-600 mb-2 sm:mb-3">
          🏆 Achievements
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
          Celebrate your accomplishments and milestones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
        {achievements.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-pink-200 dark:bg-purple-500 dark:border-white dark:hover:shadow-lg dark:hover:shadow-slate-700/50 ease-in-out delay-150 duration-300"
          >
            <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-600 dark:from-amber-500 dark:to-yellow-600 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-2 leading-tight">
                  {item.title}
                </h2>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-amber-300 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Achievement Stats */}
      <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
              {achievements.length}
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-white">
              Total Achievements
            </div>
          </div>
          <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
              2024
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-white">
              Latest Achievement
            </div>
          </div>
          <div className="bg-white dark:bg-purple-600/50 rounded-xl p-4 sm:p-6 text-center border border-pink-200 dark:border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-amber-400 mb-2">
              98%
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-white">
              Highest Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;