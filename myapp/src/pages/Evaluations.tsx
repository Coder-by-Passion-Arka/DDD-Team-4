import React from 'react';
import { motion } from 'framer-motion';

const evaluations = [
  { subject: 'Mathematics', score: 92, grade: 'A+', feedback: 'Excellent problem-solving skills.' },
  { subject: 'Physics', score: 85, grade: 'A', feedback: 'Very good understanding of concepts.' },
  { subject: 'English', score: 78, grade: 'B+', feedback: 'Good writing skills but improve grammar.' },
];

const Evaluation: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">📊 Evaluation Report</h1>

      <div className="grid gap-6 max-w-5xl mx-auto">
        {evaluations.map((evaluation, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{evaluation.subject}</h2>
            <p className="text-gray-600 mt-1">Grade: <span className="font-semibold">{evaluation.grade}</span></p>
            <p className="text-gray-600">Score: <span className="font-semibold">{evaluation.score}/100</span></p>
            <p className="mt-2 text-gray-700 italic">“{evaluation.feedback}”</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Evaluation;

