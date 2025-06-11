// import React from 'react';
// import { BarChart3, BookOpen, Clock, Target, Flame, TrendingUp, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
// import StatsCard from './StatsCard';
// import ProgressChart from './ProgressChart';
// import StreakCounter from './StreakCounter';
// import RecentAssignments from './RecentAssignments';
// const Dashboard: React.FC = () => {
//   // We have to make this dynamic by fetching the data from a databse
//   const stats = {
//     submitted: 24,
//     inProgress: 3,
//     toEvaluate: 7,
//     completed: 180
//   };

//   const dailyProgress = [
//     { day: 'Mon', submissions: 4, evaluations: 2 },
//     { day: 'Tue', submissions: 6, evaluations: 3 },
//     { day: 'Wed', submissions: 3, evaluations: 5 },
//     { day: 'Thu', submissions: 8, evaluations: 4 },
//     { day: 'Fri', submissions: 5, evaluations: 6 },
//     { day: 'Sat', submissions: 2, evaluations: 1 },
//     { day: 'Sun', submissions: 3, evaluations: 2 }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
//       <main className="p-8 md:ml-64">
//         <div className="h-full ">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//               Evaluation Dashboard
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300">
//               Track your peer evaluation progress and assignments
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <StatsCard
//               title="Total Submitted"
//               value={stats.submitted}
//               icon={CheckCircle}
//               color="emerald"
//               trend="+12%"
//             />
//             <StatsCard
//               title="In Progress"
//               value={stats.inProgress}
//               icon={Clock}
//               color="amber"
//               trend="-5%"
//             />
//             <StatsCard
//               title="To Evaluate"
//               value={stats.toEvaluate}
//               icon={Target}
//               color="blue"
//               trend="+8%"
//             />
//             <StatsCard
//               title="Completed"
//               value={stats.completed}
//               icon={BookOpen}
//               color="purple"
//               trend="+23%"
//             />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//             <div className="lg:col-span-2">
//               <ProgressChart data={dailyProgress} />
//             </div>
//             <div>
//               <StreakCounter currentStreak={12} bestStreak={28} />
//             </div>
//           </div>

//           <RecentAssignments />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;