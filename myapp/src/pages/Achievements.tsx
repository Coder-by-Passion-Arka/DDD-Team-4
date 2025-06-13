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
    <div
      className="p-8 bg-gradient-to-br from-yellow-50 to-pink-100
    dark:bg-gradient-to-br 
    m-[0.3rem]
    dark:to-pink-500 dark:from-purple-900
     min-h-screen
     rounded-xl
     hfit"
    >
      <h1 className="text-4xl font-bold text-center text-pink-700 mb-10 dark:text-amber-600">
        🏆 Achievements
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {achievements.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-pink-200
            dark:bg-purple-500
            dark:border-white
            dark:hover:shadow-lg dark:hover:shadow-slate-700/50 ease-in-out delay-150 duration-300
            "
          >
            <h2
              className="text-xl font-semibold text-gray-800
            dark:text-white"
            >
              {item.title}
            </h2>
            <p
              className="text-gray-600 mt-2
            dark:text-amber-300"
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;