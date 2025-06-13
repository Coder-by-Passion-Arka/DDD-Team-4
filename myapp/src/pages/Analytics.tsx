import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register the custom color schema for the chart
const colorSchema = {
  blue: `rgba(${37}, ${99}, ${235}, 1)`,
  red: `rgba(${235}, ${99}, ${37}, 1)`,
  orange: `rgba(${235}, ${99}, ${37}, 1)`,
  green: `rgba(${37}, ${235}, ${99}, 1)`,
  purple: `rgba(${142}, ${68}, ${235}, 1)`,
  pink: `rgba(${235}, ${68}, ${142}, 1)`,
  yellow: `rgba(${255}, ${235}, ${68}, 1)`,
  black: `rgba(0, 0, 0, 1)`,
  transperant: `rgba(0, 0, 0, 0)`,
  white: `rgba(255, 255, 255, 1)`,
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Revenue",
      data: [0, 200, 120, 600, 800, 1800, 2800],
      borderColor: colorSchema.blue,
      backgroundColor: colorSchema.transperant,
      tension: 0.4,
      pointBackgroundColor: colorSchema.orange,
      pointBorderColor: colorSchema.orange,
      fill: true,
    },
    {
      label: "Expenses",
      data: [8000, 9000, 9500, 10000, 10500, 11000, 12000],
      borderColor: "#f59e42",
      backgroundColor: "rgba(245,158,66,0.2)",
      tension: 0.4,
      pointBackgroundColor: colorSchema.transperant,
      pointBorderColor: colorSchema.white,
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#2563eb",
        font: { size: 16, weight: "bold" },
      },
    },
    title: {
      display: true,
      text: "Monthly Revenue vs Expenses",
      color: "#1e293b",
      font: { size: 22, weight: "bold" },
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: { color: "#64748b", font: { size: 14 } },
      grid: { color: "rgba(100,116,139,0.1)" },
    },
    y: {
      ticks: { color: "#64748b", font: { size: 14 } },
      grid: { color: "rgba(100,116,139,0.1)" },
    },
  },
};

const Analytics: React.FC = () => (
  <div className="p-8 bg-white dark:bg-slate-800 text-xl dark:text-white border-2 border-blue-300/90 rounded-xl shadow-lg hover:shadow-blue-900 transition-all duration-300 m-[0.3rem]">
    <Line data={data} options={options} />
  </div>
);

export default Analytics;
