import React, { useState, useMemo } from "react";
import { useAnalytics } from "../contexts/AnalyticsContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js/auto";
import { Line, Doughnut, Radar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Simple icon components
const ChartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

const AssignmentIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const RadarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

// Color schema
const colorSchema = {
  blue: "#2563eb",
  red: "#dc2626",
  orange: "#ea580c",
  green: "#16a34a",
  purple: "#9333ea",
  pink: "#db2777",
  yellow: "#ca8a04",
  cyan: "#0891b2",
  indigo: "#4338ca",
  emerald: "#059669",
  slate: "#475569",
  gray: "#6b7280",
};

// Define course names for consistency
const courseNames = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "History",
];

// Chart options
const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          size: 12,
          weight: "bold" as const,
        },
      },
    },
    title: {
      display: true,
      text: "Student Participation in Ongoing Courses",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} students (${percentage}%)`;
        },
      },
    },
  },
  cutout: "60%",
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          size: 12,
          weight: "bold" as const,
        },
      },
    },
    title: {
      display: true,
      text: "Weekly Assignment & Evaluation Submissions",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#ffffff",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
};

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          size: 12,
          weight: "bold" as const,
        },
      },
    },
    title: {
      display: true,
      text: "Student Performance Comparison",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#ffffff",
      borderWidth: 1,
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      angleLines: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      pointLabels: {
        font: {
          size: 12,
          weight: "bold" as const,
        },
      },
      ticks: {
        stepSize: 20,
        font: {
          size: 10,
        },
      },
    },
  },
};

// Main Analytics component
const Analytics: React.FC = () => {
  const {
    allDailyData,
    currentSemesterIndex,
    setCurrentSemesterIndex,
    isLoading,
    lastDataUpdate,
    refreshData,
    getCurrentSemesterData,
    getWeeklyData,
    getSemesterData,
  } = useAnalytics();

  const [selectedStudent, setSelectedStudent] = useState("Current Student");
  const students = [
    "Current Student",
    "Top Performer",
    "Average Student",
    "Struggling Student",
  ];

  // Process data for charts using analytics context
  const courseParticipationData = useMemo(() => {
    const semesterData = getCurrentSemesterData();

    // Generate course participation based on semester data
    const participationValues = courseNames.map((_, index) => {
      const baseValue =
        semesterData[index % semesterData.length]?.reviewed || 200;
      return Math.floor(baseValue * (0.8 + Math.random() * 0.4)); // Add some variation
    });

    return {
      labels: courseNames,
      datasets: [
        {
          label: "Students Enrolled",
          data: participationValues,
          backgroundColor: [
            colorSchema.blue,
            colorSchema.green,
            colorSchema.purple,
            colorSchema.orange,
            colorSchema.pink,
            colorSchema.cyan,
          ],
          borderColor: "#ffffff",
          borderWidth: 3,
          hoverOffset: 10,
        },
      ],
    };
  }, [getCurrentSemesterData]);

  const assignmentEvaluationData = useMemo(() => {
    const weeklyData = getWeeklyData(currentSemesterIndex);

    // Generate realistic weekly submission data
    const weeks = Math.min(weeklyData.length, 8);
    const labels = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);

    const assignmentsData = weeklyData
      .slice(0, weeks)
      .map((week) =>
        Math.min(100, Math.floor((week.reviewed / week.evaluated) * 100) || 85)
      );

    const evaluationsData = weeklyData
      .slice(0, weeks)
      .map((week) =>
        Math.min(
          100,
          Math.floor(
            (week.evaluated / (week.reviewed + week.evaluated)) * 100
          ) || 80
        )
      );

    const projectsData = weeklyData
      .slice(0, weeks)
      .map((_, i) => Math.floor(45 + i * 2.5 + Math.random() * 10));

    return {
      labels,
      datasets: [
        {
          label: "Assignments Submitted (%)",
          data: assignmentsData,
          borderColor: colorSchema.blue,
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          tension: 0.4,
          pointBackgroundColor: colorSchema.blue,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          fill: true,
        },
        {
          label: "Evaluations Completed (%)",
          data: evaluationsData,
          borderColor: colorSchema.green,
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          tension: 0.4,
          pointBackgroundColor: colorSchema.green,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          fill: true,
        },
        {
          label: "Projects Delivered (%)",
          data: projectsData,
          borderColor: colorSchema.purple,
          backgroundColor: "rgba(147, 51, 234, 0.1)",
          tension: 0.4,
          pointBackgroundColor: colorSchema.purple,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          fill: true,
        },
      ],
    };
  }, [getWeeklyData, currentSemesterIndex]);

  const studentPerformanceData = useMemo(() => {
    const semesterData = getCurrentSemesterData();
    const avgReviewed =
      semesterData.reduce((sum, data) => sum + data.reviewed, 0) /
      semesterData.length;
    const avgEvaluated =
      semesterData.reduce((sum, data) => sum + data.evaluated, 0) /
      semesterData.length;

    // Generate performance data based on analytics context
    const generateStudentData = (multiplier: number, variance: number) =>
      [
        Math.floor((avgReviewed / 100) * multiplier + variance), // Quiz Performance
        Math.floor((avgEvaluated / 80) * multiplier + variance), // Assignment Scores
        Math.floor(
          ((avgReviewed + avgEvaluated) / 200) * multiplier + variance
        ), // Evaluation Grades
        Math.floor(85 * multiplier + variance), // Teacher Points
        Math.floor(82 * multiplier + variance), // Participation
        Math.floor(90 * multiplier + variance), // Attendance
      ].map((val) => Math.max(0, Math.min(100, val)));

    const datasets = [];

    switch (selectedStudent) {
      case "Top Performer":
        datasets.push({
          label: "Top Performer",
          data: generateStudentData(1.2, 5),
          backgroundColor: "rgba(22, 163, 74, 0.2)",
          borderColor: colorSchema.green,
          borderWidth: 2,
          pointBackgroundColor: colorSchema.green,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
        });
        break;
      case "Struggling Student":
        datasets.push({
          label: "Struggling Student",
          data: generateStudentData(0.8, -5),
          backgroundColor: "rgba(220, 38, 38, 0.2)",
          borderColor: colorSchema.red,
          borderWidth: 2,
          pointBackgroundColor: colorSchema.red,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
        });
        break;
      case "Average Student":
        datasets.push({
          label: "Average Student",
          data: generateStudentData(1.0, 0),
          backgroundColor: "rgba(147, 51, 234, 0.2)",
          borderColor: colorSchema.purple,
          borderWidth: 2,
          pointBackgroundColor: colorSchema.purple,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
        });
        break;
      default:
        datasets.push({
          label: "Current Student",
          data: generateStudentData(1.1, 2),
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          borderColor: colorSchema.blue,
          borderWidth: 2,
          pointBackgroundColor: colorSchema.blue,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
        });
    }

    // Always show class average for comparison
    datasets.push({
      label: "Class Average",
      data: generateStudentData(1.0, 0),
      backgroundColor: "rgba(107, 114, 128, 0.2)",
      borderColor: colorSchema.gray,
      borderWidth: 2,
      pointBackgroundColor: colorSchema.gray,
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 5,
    });

    return {
      labels: [
        "Quiz Performance",
        "Assignment Scores",
        "Evaluation Grades",
        "Teacher Points",
        "Participation",
        "Attendance",
      ],
      datasets,
    };
  }, [getCurrentSemesterData, selectedStudent]);

  // Calculate summary statistics from context data
  const summaryStats = useMemo(() => {
    const totalParticipation = courseParticipationData.datasets[0].data.reduce(
      (a, b) => a + b,
      0
    );
    const avgAssignmentScore =
      assignmentEvaluationData.datasets[0].data.reduce((a, b) => a + b, 0) /
      assignmentEvaluationData.datasets[0].data.length;
    const completionRate =
      assignmentEvaluationData.datasets[1].data.reduce((a, b) => a + b, 0) /
      assignmentEvaluationData.datasets[1].data.length;

    return {
      totalStudents: totalParticipation,
      avgAssignmentScore: avgAssignmentScore.toFixed(1),
      completionRate: completionRate.toFixed(1),
      activeCourses: courseNames.length,
    };
  }, [courseParticipationData, assignmentEvaluationData]);

  if (isLoading) {
    return (
      <div className="analytics-container mb-6 sm:mb-8 lg:mb-10 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container mb-6 sm:mb-8 lg:mb-10">
      {/* Header with data info */}
      <div className="analytics-heading sm:text-3xl lg:text-4xl font-bold m-2 text-center text-wrap text-blue-800 dark:text-blue-300">
        <ChartIcon className="sm:w-7 sm:h-7 inline-block m-2" />
        <span>Student Analytics Dashboard</span>
      </div>

      {/* Data status and controls */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg m-[0.3rem]">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Last updated: {lastDataUpdate}</p>
          <p>
            Semester:{" "}
            {currentSemesterIndex === 0
              ? "Previous (Dec-Apr)"
              : "Current (Jul-Nov)"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentSemesterIndex(currentSemesterIndex === 0 ? 1 : 0)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Switch Semester
          </button>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <RefreshIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Course Participation Donut Chart */}
      <div className="p-6 bg-white dark:bg-slate-800 text-xl dark:text-white border-2 border-blue-300/90 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 m-[0.3rem] mb-6">
        <div className="flex items-center justify-center mb-4">
          <UsersIcon className="w-6 h-6 mr-2 text-blue-600" />
          <h2 className="text-2xl font-bold text-center">
            Course Participation Overview
          </h2>
        </div>
        <div className="h-96 w-full">
          <Doughnut data={courseParticipationData} options={donutOptions} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Students: {summaryStats.totalStudents}
          </p>
        </div>
      </div>

      {/* Assignment & Evaluation Line Chart */}
      <div className="p-6 bg-white dark:bg-slate-800 text-xl dark:text-white border-2 border-green-300/90 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 m-[0.3rem] mb-6">
        <div className="flex items-center justify-center mb-4">
          <AssignmentIcon className="w-6 h-6 mr-2 text-green-600" />
          <h2 className="text-2xl font-bold text-center">
            Weekly Submission Trends
          </h2>
        </div>
        <div className="h-96 w-full">
          <Line data={assignmentEvaluationData} options={lineOptions} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track student engagement through assignment and evaluation
            submissions
          </p>
        </div>
      </div>

      {/* Student Performance Radar Chart */}
      <div className="p-6 bg-white dark:bg-slate-800 text-xl dark:text-white border-2 border-purple-300/90 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 m-[0.3rem] mb-6">
        <div className="flex items-center justify-center mb-4">
          <RadarIcon className="w-6 h-6 mr-2 text-purple-600" />
          <h2 className="text-2xl font-bold text-center">
            Student Performance Analysis
          </h2>
        </div>

        {/* Student selector */}
        <div className="mb-4 flex justify-center">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            {students.map((student) => (
              <option key={student} value={student}>
                {student}
              </option>
            ))}
          </select>
        </div>

        <div className="h-96 w-full">
          <Radar data={studentPerformanceData} options={radarOptions} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Compare student performance across multiple assessment categories
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-[0.3rem]">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Total Students
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {summaryStats.totalStudents.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            Avg Assignment Score
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {summaryStats.avgAssignmentScore}%
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
            Completion Rate
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {summaryStats.completionRate}%
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-700">
          <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
            Active Courses
          </h3>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {summaryStats.activeCourses}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

// ================================================================================= //

// import React, { useState } from "react";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   RadialLinearScale,
//   Filler,
// } from "chart.js/auto";
// import { Line, Doughnut, Radar } from "react-chartjs-2";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   RadialLinearScale,
//   Filler
// );

// // Simple icon components
// const ChartIcon = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//     />
//   </svg>
// );

// const UsersIcon = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//     />
//   </svg>
// );

// const AssignmentIcon = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//     />
//   </svg>
// );

// const RadarIcon = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M13 10V3L4 14h7v7l9-11h-7z"
//     />
//   </svg>
// );

// // Color schema
// const colorSchema = {
//   blue: "#2563eb",
//   red: "#dc2626",
//   orange: "#ea580c",
//   green: "#16a34a",
//   purple: "#9333ea",
//   pink: "#db2777",
//   yellow: "#ca8a04",
//   cyan: "#0891b2",
//   indigo: "#4338ca",
//   emerald: "#059669",
//   slate: "#475569",
//   gray: "#6b7280",
// };

// // Dummy data for student participation in ongoing courses (Donut Chart)
// const courseParticipationData = {
//   labels: [
//     "Computer Science",
//     "Mathematics",
//     "Physics",
//     "Chemistry",
//     "English",
//     "History",
//   ],
//   datasets: [
//     {
//       label: "Students Enrolled",
//       data: [450, 320, 280, 195, 380, 150],
//       backgroundColor: [
//         colorSchema.blue,
//         colorSchema.green,
//         colorSchema.purple,
//         colorSchema.orange,
//         colorSchema.pink,
//         colorSchema.cyan,
//       ],
//       borderColor: "#ffffff",
//       borderWidth: 3,
//       hoverOffset: 10,
//     },
//   ],
// };

// // Dummy data for assignments and evaluations (Line Chart)
// const assignmentEvaluationData = {
//   labels: [
//     "Week 1",
//     "Week 2",
//     "Week 3",
//     "Week 4",
//     "Week 5",
//     "Week 6",
//     "Week 7",
//     "Week 8",
//   ],
//   datasets: [
//     {
//       label: "Assignments Submitted",
//       data: [85, 92, 78, 96, 88, 94, 82, 90],
//       borderColor: colorSchema.blue,
//       backgroundColor: "rgba(37, 99, 235, 0.1)",
//       tension: 0.4,
//       pointBackgroundColor: colorSchema.blue,
//       pointBorderColor: "#ffffff",
//       pointBorderWidth: 2,
//       pointRadius: 6,
//       fill: true,
//     },
//     {
//       label: "Evaluations Completed",
//       data: [78, 85, 82, 89, 91, 87, 93, 88],
//       borderColor: colorSchema.green,
//       backgroundColor: "rgba(22, 163, 74, 0.1)",
//       tension: 0.4,
//       pointBackgroundColor: colorSchema.green,
//       pointBorderColor: "#ffffff",
//       pointBorderWidth: 2,
//       pointRadius: 6,
//       fill: true,
//     },
//     {
//       label: "Projects Delivered",
//       data: [45, 52, 48, 58, 55, 62, 59, 65],
//       borderColor: colorSchema.purple,
//       backgroundColor: "rgba(147, 51, 234, 0.1)",
//       tension: 0.4,
//       pointBackgroundColor: colorSchema.purple,
//       pointBorderColor: "#ffffff",
//       pointBorderWidth: 2,
//       pointRadius: 6,
//       fill: true,
//     },
//   ],
// };

// // Dummy data for student performance radar chart
// const studentPerformanceData = {
//   labels: [
//     "Quiz Performance",
//     "Assignment Scores",
//     "Evaluation Grades",
//     "Teacher Points",
//     "Participation",
//     "Attendance",
//   ],
//   datasets: [
//     {
//       label: "John Doe",
//       data: [85, 92, 78, 88, 90, 95],
//       backgroundColor: "rgba(37, 99, 235, 0.2)",
//       borderColor: colorSchema.blue,
//       borderWidth: 2,
//       pointBackgroundColor: colorSchema.blue,
//       pointBorderColor: "#ffffff",
//       pointBorderWidth: 2,
//       pointRadius: 5,
//     },
//     {
//       label: "Jane Smith",
//       data: [78, 85, 92, 80, 85, 88],
//       backgroundColor: "rgba(22, 163, 74, 0.2)",
//       borderColor: colorSchema.green,
//       borderWidth: 2,
//       pointBackgroundColor: colorSchema.green,
//       pointBorderColor: "#ffffff",
//       pointBorderWidth: 2,
//       pointRadius: 5,
//     },
//     {
//       label: "Class Average",
//       data: [75, 80, 85, 78, 82, 85],
//       backgroundColor: "rgba(147, 51, 234, 0.2)",
//       borderColor: colorSchema.purple,
//       borderWidth: 2,
//       pointBackgroundColor: colorSchema.purple,
//       pointBorderColor: "#ffffff",
//       pointBorderWidth: 2,
//       pointRadius: 5,
//     },
//   ],
// };

// // Chart options
// const donutOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "bottom" as const,
//       labels: {
//         padding: 20,
//         usePointStyle: true,
//         pointStyle: "circle",
//         font: {
//           size: 12,
//           weight: "bold" as const,
//         },
//       },
//     },
//     title: {
//       display: true,
//       text: "Student Participation in Ongoing Courses",
//       font: {
//         size: 18,
//         weight: "bold" as const,
//       },
//       padding: {
//         top: 10,
//         bottom: 30,
//       },
//     },
//     tooltip: {
//       callbacks: {
//         label: function (context: any) {
//           const label = context.label || "";
//           const value = context.parsed || 0;
//           const total = context.dataset.data.reduce(
//             (a: number, b: number) => a + b,
//             0
//           );
//           const percentage = ((value / total) * 100).toFixed(1);
//           return `${label}: ${value} students (${percentage}%)`;
//         },
//       },
//     },
//   },
//   cutout: "60%",
// };

// const lineOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "top" as const,
//       labels: {
//         padding: 20,
//         usePointStyle: true,
//         pointStyle: "circle",
//         font: {
//           size: 12,
//           weight: "bold" as const,
//         },
//       },
//     },
//     title: {
//       display: true,
//       text: "Weekly Assignment & Evaluation Submissions",
//       font: {
//         size: 18,
//         weight: "bold" as const,
//       },
//       padding: {
//         top: 10,
//         bottom: 30,
//       },
//     },
//     tooltip: {
//       mode: "index" as const,
//       intersect: false,
//       backgroundColor: "rgba(0, 0, 0, 0.8)",
//       titleColor: "#ffffff",
//       bodyColor: "#ffffff",
//       borderColor: "#ffffff",
//       borderWidth: 1,
//     },
//   },
//   scales: {
//     x: {
//       grid: {
//         color: "rgba(0, 0, 0, 0.1)",
//       },
//       ticks: {
//         font: {
//           size: 12,
//         },
//       },
//     },
//     y: {
//       beginAtZero: true,
//       grid: {
//         color: "rgba(0, 0, 0, 0.1)",
//       },
//       ticks: {
//         font: {
//           size: 12,
//         },
//       },
//     },
//   },
//   interaction: {
//     intersect: false,
//     mode: "index" as const,
//   },
// };

// const radarOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "bottom" as const,
//       labels: {
//         padding: 20,
//         usePointStyle: true,
//         pointStyle: "circle",
//         font: {
//           size: 12,
//           weight: "bold" as const,
//         },
//       },
//     },
//     title: {
//       display: true,
//       text: "Student Performance Comparison",
//       font: {
//         size: 18,
//         weight: "bold" as const,
//       },
//       padding: {
//         top: 10,
//         bottom: 30,
//       },
//     },
//     tooltip: {
//       backgroundColor: "rgba(0, 0, 0, 0.8)",
//       titleColor: "#ffffff",
//       bodyColor: "#ffffff",
//       borderColor: "#ffffff",
//       borderWidth: 1,
//     },
//   },
//   scales: {
//     r: {
//       beginAtZero: true,
//       max: 100,
//       grid: {
//         color: "rgba(0, 0, 0, 0.1)",
//       },
//       angleLines: {
//         color: "rgba(0, 0, 0, 0.1)",
//       },
//       pointLabels: {
//         font: {
//           size: 12,
//           weight: "bold" as const,
//         },
//       },
//       ticks: {
//         stepSize: 20,
//         font: {
//           size: 10,
//         },
//       },
//     },
//   },
// };

// // Chart components
// const DonutChart: React.FC = () => (
//   <div className="h-96 w-full">
//     <Doughnut data={courseParticipationData} options={donutOptions} />
//   </div>
// );

// const LineChart: React.FC = () => (
//   <div className="h-96 w-full">
//     <Line data={assignmentEvaluationData} options={lineOptions} />
//   </div>
// );

// const RadarChart: React.FC = () => (
//   <div className="h-96 w-full">
//     <Radar data={studentPerformanceData} options={radarOptions} />
//   </div>
// );

// // Main Analytics component
// const Analytics: React.FC = () => {
//   const [selectedStudent, setSelectedStudent] = useState("John Doe");

//   const students = [
//     "John Doe",
//     "Jane Smith",
//     "Mike Johnson",
//     "Sarah Wilson",
//     "David Brown",
//   ];

//   return (
//     <div className="analytics-container mb-6 sm:mb-8 lg:mb-10">
//       {/* Header */}
//       <div className="analytics-heading sm:text-3xl lg:text-4xl font-bold m-2 text-center text-wrap text-blue-800 dark:text-blue-300">
//         <ChartIcon className="sm:w-7 sm:h-7 inline-block m-2" />
//         <span>Student Analytics Dashboard</span>
//       </div>

//       {/* Course Participation Donut Chart */}
//       <div className="p-6 bg-white dark:bg-slate-800 text-xl dark:text-white border-2 border-blue-300/90 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 m-[0.3rem] mb-6">
//         <div className="flex items-center justify-center mb-4">
//           <UsersIcon className="w-6 h-6 mr-2 text-blue-600" />
//           <h2 className="text-2xl font-bold text-center">
//             Course Participation Overview
//           </h2>
//         </div>
//         <DonutChart />
//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Total Students:{" "}
//             {courseParticipationData.datasets[0].data.reduce(
//               (a, b) => a + b,
//               0
//             )}
//           </p>
//         </div>
//       </div>

//       {/* Assignment & Evaluation Line Chart */}
//       <div className="p-6 bg-white dark:bg-slate-800 text-xl dark:text-white border-2 border-green-300/90 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 m-[0.3rem] mb-6">
//         <div className="flex items-center justify-center mb-4">
//           <AssignmentIcon className="w-6 h-6 mr-2 text-green-600" />
//           <h2 className="text-2xl font-bold text-center">
//             Weekly Submission Trends
//           </h2>
//         </div>
//         <LineChart />
//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Track student engagement through assignment and evaluation
//             submissions
//           </p>
//         </div>
//       </div>

//       {/* Student Performance Radar Chart */}
//       <div className="p-6 bg-white dark:bg-slate-800 text-xl dark:text-white border-2 border-purple-300/90 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 m-[0.3rem] mb-6">
//         <div className="flex items-center justify-center mb-4">
//           <RadarIcon className="w-6 h-6 mr-2 text-purple-600" />
//           <h2 className="text-2xl font-bold text-center">
//             Student Performance Analysis
//           </h2>
//         </div>

//         {/* Student selector */}
//         <div className="mb-4 flex justify-center">
//           <select
//             value={selectedStudent}
//             onChange={(e) => setSelectedStudent(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
//           >
//             {students.map((student) => (
//               <option key={student} value={student}>
//                 {student}
//               </option>
//             ))}
//           </select>
//         </div>

//         <RadarChart />
//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Compare student performance across multiple assessment categories
//           </p>
//         </div>
//       </div>

//       {/* Summary Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-[0.3rem]">
//         <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
//           <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
//             Total Students
//           </h3>
//           <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//             1,775
//           </p>
//         </div>
//         <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
//           <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
//             Avg Assignment Score
//           </h3>
//           <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//             87.5%
//           </p>
//         </div>
//         <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700">
//           <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
//             Completion Rate
//           </h3>
//           <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//             94.2%
//           </p>
//         </div>
//         <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-700">
//           <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
//             Active Courses
//           </h3>
//           <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
//             6
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
