import React from "react";
import { Badge, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  badgeContent: string;
  color: "emerald" | "amber" | "blue" | "purple" | "red";
  trend: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  badgeContent,
  color,
  trend,
}) => {
  const colorClasses = {
    emerald: "from-emerald-500 to-green-600 bg-emerald-50 text-emerald-700",
    amber: "from-amber-500 to-orange-600 bg-amber-50 text-amber-700",
    blue: "from-blue-500 to-indigo-600 bg-blue-50 text-blue-700",
    purple: "from-purple-500 to-indigo-600 bg-purple-50 text-purple-700",
    red: "from-red-500 to-pink-600 bg-red-50 text-red-700",
  };

  const isPositiveTrend = trend.startsWith("+");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
            colorClasses[color].split(" ")[0]
          } ${
            colorClasses[color].split(" ")[1]
          } flex items-center justify-center shadow-lg`}
        >
          <Badge className="w-6 h-6 text-white">{badgeContent}</Badge>
        </div>
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositiveTrend
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositiveTrend ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{trend}</span>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
          {value}
        </h3>
        <p className="text-gray-600 font-medium">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
