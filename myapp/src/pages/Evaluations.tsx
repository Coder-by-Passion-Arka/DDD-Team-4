import React from 'react';
import { motion } from 'framer-motion';

const evaluations = [
  { subject: 'Mathematics', score: 92, grade: 'A+', feedback: 'Excellent problem-solving skills.' },
  { subject: 'Physics', score: 85, grade: 'A', feedback: 'Very good understanding of concepts.' },
  { subject: 'English', score: 78, grade: 'B+', feedback: 'Good writing skills but improve grammar.' },
];

const Evaluation: React.FC = () => {
  return (
    <div
      className="p-8 m-[0.3rem] bg-gradient-to-br from-blue-50 to-purple-100
    dark:from-purple-600 dark:to-slate-800 min-h-screen rounded-xl"
    >
      <h1
        className="text-4xl font-bold text-center text-indigo-800
      dark:text-blue-300 mb-10
      "
      >
        📊 Evaluation Report
      </h1>

      <div className="grid gap-6 max-w-5xl mx-auto ">
        {evaluations.map((evaluation, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500
            dark:border-white hover:shadow-xl transition
            ease-in-out delay-150 duration-300
            dark:bg-indigo-100/30
            hover:border-slate-500/30
            dark:hover:shadow-lg dark:hover:shadow-gray-900/50"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {evaluation.subject}
            </h2>
            <p className="text-gray-600 mt-1 dark:text-white">
              Grade: <span className="font-semibold">{evaluation.grade}</span>
            </p>
            <p
              className="text-gray-600
            dark:text-white"
            >
              Score:{" "}
              <span className="font-semibold">{evaluation.score}/100</span>
            </p>
            <p className="mt-2 text-gray-700 italic dark:text-white">
              “{evaluation.feedback}”
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Evaluation;

