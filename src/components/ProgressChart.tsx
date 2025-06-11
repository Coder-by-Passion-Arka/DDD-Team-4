import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressData {
  day: string;
  submissions: number;
  evaluations: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const [view, setView] = useState<"submission" | "evaluation">("submission");

  const chartData = {
    labels: data.map((item) => item.day),
    datasets: [
      {
        label: view === "submission" ? "Submissions" : "Evaluations",
        data: data.map((item) =>
          view === "submission" ? item.submissions : item.evaluations
        ),
        backgroundColor:
          view === "submission"
            ? "rgba(59, 130, 246, 0.8)"
            : "rgba(16, 185, 129, 0.8)",
        borderColor:
          view === "submission"
            ? "rgba(59, 130, 246, 1)"
            : "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          view === "submission"
            ? "Daily Submissions Progress"
            : "Daily Evaluations Progress",
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day",
        },
      },
      y: {
        title: {
          display: true,
          text:
            view === "submission"
              ? "Number of Submissions"
              : "Number of Evaluations",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 rounded-l-md ${
            view === "submission"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("submission")}
        >
          Submissions
        </button>
        <button
          className={`px-4 py-2 rounded-r-md ${
            view === "evaluation"
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("evaluation")}
        >
          Evaluations
        </button>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;
