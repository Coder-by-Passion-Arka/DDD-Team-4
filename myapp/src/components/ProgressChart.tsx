import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ProgressData {
  day: string;
  submissions: number;
  evaluations: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.submissions, d.evaluations)));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Daily Progress</h3>
            <p className="text-gray-600">Submissions vs Evaluations</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Submissions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Evaluations</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 text-sm font-medium text-gray-600">{item.day}</div>
            <div className="flex-1 flex space-x-2">
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${(item.submissions / maxValue) * 100}%` }}
                >
                  {item.submissions > 0 && (
                    <span className="text-xs font-bold text-white">{item.submissions}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${(item.evaluations / maxValue) * 100}%` }}
                >
                  {item.evaluations > 0 && (
                    <span className="text-xs font-bold text-white">{item.evaluations}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;