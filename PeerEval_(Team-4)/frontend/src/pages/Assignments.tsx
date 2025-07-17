// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   User as UserIcon,
//   Layers as LayersIcon,
//   Loader2 as Loader2Icon,
//   Plus as PlusIcon,
//   BookOpen as BookOpenIcon,
//   Users as UsersIcon,
//   Clock as ClockIcon,
//   CheckCircle as CheckCircleIcon,
//   AlertCircle as AlertCircleIcon,
//   FileText as FileTextIcon,
//   Target as TargetIcon,
//   Eye as EyeIcon,
//   Calendar as CalendarIcon,
//   BarChart3 as BarChart3Icon,
//   Shuffle as ShuffleIcon,
// } from "lucide-react";
// import SkillSuggestionModal from "../components/SkillSuggestionModal";
// import { useSkillSuggestion } from "../hooks/useSkillSuggestion";
// import { useAuth } from "../contexts/AuthContext";
// import { apiService } from "../services/api";

// interface Assignment {
//   _id: string;
//   title: string;
//   subject: string;
//   description: string;
//   dueDate: string;
//   createdAt: string;
//   createdBy: string;
//   status:
//     | "draft"
//     | "published"
//     | "active"
//     | "closed"
//     | "evaluation_phase"
//     | "completed"
//     | "archived";
//   tags: string[];
//   maxScore: number;
//   instructorId: string;
//   instructor?: {
//     userName: string;
//     userEmail: string;
//   };
//   courseId: {
//     _id: string;
//     title: string;
//     courseCode: string;
//   };
//   // Submission tracking
//   submissionStats: {
//     totalSubmissions: number;
//     submittedCount: number;
//     pendingCount: number;
//     lateCount: number;
//   };
//   // Evaluation tracking
//   evaluationStats: {
//     totalEvaluations: number;
//     completedEvaluations: number;
//     pendingEvaluations: number;
//     averageScore?: number;
//   };
//   // User-specific data
//   userSubmission?: {
//     _id: string;
//     status:
//       | "draft"
//       | "submitted"
//       | "under_evaluation"
//       | "evaluated"
//       | "finalized";
//     submittedAt?: string;
//     score?: number;
//     grade?: string;
//     feedback?: string;
//   };
//   userEvaluations?: Array<{
//     _id: string;
//     status: "assigned" | "in_progress" | "submitted" | "reviewed";
//     dueDate: string;
//     submitterName: string;
//   }>;
//   // Add submissionSettings for modal usage
//   submissionSettings?: {
//     minWordCount?: number;
//     maxWordCount?: number;
//     requireFileAttachment?: boolean;
//     allowedFileTypes?: string[];
//     maxFileSize?: number;
//   };
// }

// interface AssignmentData {
//   myAssignments: Assignment[];
//   createdAssignments: Assignment[];
//   evaluationQueue: Assignment[];
// }

// const AssignmentPage: React.FC = () => {
//   const { state, updateProfile } = useAuth();

//   // State variables
//   const [userSkills, setUserSkills] = useState<string[]>(
//     state.user?.userSkills || []
//   );
//   const [assignmentData, setAssignmentData] = useState<AssignmentData>({
//     myAssignments: [],
//     createdAssignments: [],
//     evaluationQueue: [],
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [userRole, setUserRole] = useState<string>(
//     state.user?.role || "student"
//   );
//   const [showSubmissionModal, setShowSubmissionModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] =
//     useState<Assignment | null>(null);
//   const [showEvaluationSetup, setShowEvaluationSetup] = useState(false);
//   const [activeTab, setActiveTab] = useState<string>("created");

//   // Skill suggestion hook
//   const skillSuggestion = useSkillSuggestion({
//     userSkills,
//     onSkillsAdded: async (newSkills: string[]) => {
//       const updatedSkills = [...userSkills, ...newSkills];
//       setUserSkills(updatedSkills);
//       try {
//         await updateProfile({ userSkills: updatedSkills });
//         console.log("Added skills to profile:", newSkills);
//       } catch (error) {
//         console.error("Failed to update skills in profile:", error);
//       }
//     },
//   });

//   // Update user skills when user data changes
//   useEffect(() => {
//     if (state.user?.userSkills) {
//       setUserSkills(state?.user?.userSkills);
//     }
//     if (state.user?.role) {
//       setUserRole(state.user.role);
//     }
//   }, [state.user]);

//   // Fetch assignments on component mount
//   useEffect(() => {
//     fetchAssignments();
//   }, [userRole]);

//   const fetchAssignments = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await apiService.get("/assignments", {
//         params: {
//           page: 1,
//           limit: 50,
//         },
//       });

//       const resData = (response as any)?.data;
//       console.log("✅ Assignments response:", resData);

//       if (resData && resData.success) {
//         const assignments = resData.data?.assignments || [];

//         let data: AssignmentData = {
//           myAssignments: [],
//           createdAssignments: [],
//           evaluationQueue: [],
//         };

//         switch (userRole) {
//           case "teacher":
//             data.createdAssignments = assignments.filter(
//               (assignment: Assignment) =>
//                 assignment.createdBy === state.user?._id
//             );
//             data.evaluationQueue = assignments.filter(
//               (assignment: Assignment) =>
//                 assignment.status === "closed" &&
//                 assignment.submissionStats.submittedCount >= 2
//             );
//             break;

//           case "admin":
//             data.createdAssignments = assignments;
//             break;

//           default: // student
//             data.myAssignments = assignments;
//             break;
//         }

//         setAssignmentData(data);
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (error: any) {
//       console.error("❌ Error fetching assignments:", error);
//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to load assignments"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmitAssignment = async (
//     assignmentId: string,
//     submissionData: { content: string; attachments: File[] }
//   ) => {
//     try {
//       const formData = new FormData();
//       formData.append("content", submissionData.content);

//       submissionData.attachments.forEach((file, index) => {
//         formData.append("attachments", file);
//       });

//       console.log("📤 Submitting assignment:", assignmentId);

//       const response = await apiService.post(
//         `/assignments/${assignmentId}/submit`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("✅ Assignment submitted:", response.data);

//       setAssignmentData((prev) => ({
//         ...prev,
//         myAssignments: prev.myAssignments.map((assignment) =>
//           assignment._id === assignmentId
//             ? {
//                 ...assignment,
//                 userSubmission: {
//                   _id: response.data.data._id,
//                   status: "submitted",
//                   submittedAt: new Date().toISOString(),
//                 },
//               }
//             : assignment
//         ),
//       }));

//       const assignment = assignmentData.myAssignments.find(
//         (a) => a._id === assignmentId
//       );
//       if (assignment) {
//         skillSuggestion.triggerSkillSuggestion({
//           id: assignment._id,
//           title: assignment.title,
//           description: assignment.description,
//           tags: assignment.tags,
//         });
//       }

//       setShowSubmissionModal(false);
//       setSelectedAssignment(null);
//     } catch (error: any) {
//       console.error("❌ Error submitting assignment:", error);
//       setError(error.response?.data?.message || "Failed to submit assignment");
//     }
//   };

//   const handleTriggerEvaluations = async (assignmentId: string) => {
//     try {
//       console.log(
//         "🔄 Triggering peer evaluations for assignment:",
//         assignmentId
//       );

//       const response = await apiService.post(
//         `/assignments/${assignmentId}/trigger-evaluations`
//       );

//       console.log("✅ Peer evaluations triggered:", response.data);

//       setAssignmentData((prev) => ({
//         ...prev,
//         createdAssignments: prev.createdAssignments.map((assignment) =>
//           assignment._id === assignmentId
//             ? { ...assignment, status: "evaluation_phase" }
//             : assignment
//         ),
//         evaluationQueue: prev.evaluationQueue.filter(
//           (assignment) => assignment._id !== assignmentId
//         ),
//       }));

//       setShowEvaluationSetup(false);
//       setSelectedAssignment(null);
//     } catch (error: any) {
//       console.error("❌ Error triggering evaluations:", error);
//       setError(
//         error.response?.data?.message || "Failed to setup peer evaluations"
//       );
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "draft":
//         return <FileTextIcon className="w-5 h-5 text-gray-500" />;
//       case "published":
//         return <BookOpenIcon className="w-5 h-5 text-blue-500" />;
//       case "closed":
//         return <ClockIcon className="w-5 h-5 text-amber-500" />;
//       case "evaluation_phase":
//         return <UsersIcon className="w-5 h-5 text-purple-500" />;
//       case "completed":
//         return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
//       default:
//         return <AlertCircleIcon className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors = {
//       draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
//       published:
//         "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
//       closed:
//         "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
//       evaluation_phase:
//         "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
//       completed:
//         "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
//     };
//     return (
//       colors[status as keyof typeof colors] ||
//       "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
//     );
//   };

//   const getDaysRemaining = (dueDate: string) => {
//     const now = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due.getTime() - now.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const renderAssignmentCard = (
//     assignment: Assignment,
//     type: "student" | "teacher" | "admin"
//   ) => {
//     const daysRemaining = getDaysRemaining(assignment.dueDate);
//     const isOverdue = daysRemaining < 0;
//     const isUrgent = daysRemaining <= 2 && daysRemaining >= 0;

//     return (
//       <motion.div
//         key={assignment._id}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={`bg-white rounded-2xl shadow-md p-6 border-l-4 hover:shadow-xl transition-all duration-300 dark:bg-gray-800 ${
//           isOverdue
//             ? "border-red-500"
//             : isUrgent
//             ? "border-amber-500"
//             : "border-indigo-500"
//         }`}
//       >
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
//               {assignment.title}
//             </h3>
//             <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
//               {assignment.instructor && (
//                 <div className="flex items-center space-x-1">
//                   <UserIcon className="w-4 h-4" />
//                   <span>{assignment.instructor.userName}</span>
//                 </div>
//               )}
//               <div className="flex items-center space-x-1">
//                 <CalendarIcon className="w-4 h-4" />
//                 <span>
//                   Due: {new Date(assignment.dueDate).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <TargetIcon className="w-4 h-4" />
//                 <span>{assignment.maxScore} points</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col items-end space-y-2">
//             <div className="flex items-center space-x-2">
//               {getStatusIcon(assignment.status)}
//               <span
//                 className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                   assignment.status
//                 )}`}
//               >
//                 {assignment.status.replace("_", " ").toUpperCase()}
//               </span>
//             </div>

//             {daysRemaining >= 0 && assignment.status === "published" && (
//               <div
//                 className={`text-xs px-2 py-1 rounded ${
//                   isUrgent
//                     ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
//                     : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {daysRemaining === 0
//                   ? "Due today"
//                   : `${daysRemaining} days left`}
//               </div>
//             )}

//             {isOverdue && assignment.status === "published" && (
//               <div className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
//                 {Math.abs(daysRemaining)} days overdue
//               </div>
//             )}
//           </div>
//         </div>

//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
//           {assignment.description}
//         </p>

//         {assignment.tags && assignment.tags.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-4">
//             {assignment.tags.map((tag, index) => (
//               <span
//                 key={index}
//                 className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Student-specific content */}
//         {type === "student" && (
//           <div className="space-y-3">
//             {assignment.userSubmission && (
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Your Submission
//                   </span>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
//                       assignment.userSubmission.status
//                     )}`}
//                   >
//                     {assignment.userSubmission.status
//                       .replace("_", " ")
//                       .toUpperCase()}
//                   </span>
//                 </div>

//                 {assignment.userSubmission.submittedAt && (
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Submitted:{" "}
//                     {new Date(
//                       assignment.userSubmission.submittedAt
//                     ).toLocaleDateString()}
//                   </p>
//                 )}

//                 {assignment.userSubmission.score !== undefined && (
//                   <div className="flex justify-between items-center mt-2">
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Score:
//                     </span>
//                     <div className="flex items-center space-x-2">
//                       <span className="font-bold text-indigo-600 dark:text-indigo-400">
//                         {assignment.userSubmission.score}/{assignment.maxScore}
//                       </span>
//                       {assignment.userSubmission.grade && (
//                         <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-xs font-medium">
//                           {assignment.userSubmission.grade}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {assignment.userSubmission.feedback && (
//                   <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
//                     "{assignment.userSubmission.feedback}"
//                   </p>
//                 )}
//               </div>
//             )}

//             {assignment.userEvaluations &&
//               assignment.userEvaluations.length > 0 && (
//                 <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
//                   <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
//                     Your Evaluation Tasks ({assignment.userEvaluations.length})
//                   </h4>
//                   <div className="space-y-1">
//                     {assignment.userEvaluations.map((evaluation, index) => (
//                       <div
//                         key={evaluation._id}
//                         className="flex justify-between items-center text-xs"
//                       >
//                         <span className="text-purple-600 dark:text-purple-400">
//                           {evaluation.submitterName}
//                         </span>
//                         <span
//                           className={`px-2 py-1 rounded ${getStatusColor(
//                             evaluation.status
//                           )}`}
//                         >
//                           {evaluation.status.replace("_", " ").toUpperCase()}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//             <div className="flex justify-between items-center pt-2">
//               <div className="text-xs text-gray-500 dark:text-gray-400">
//                 Created: {new Date(assignment.createdAt).toLocaleDateString()}
//               </div>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => setSelectedAssignment(assignment)}
//                   className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   View Details
//                 </button>

//                 {assignment.status === "published" &&
//                   (!assignment.userSubmission ||
//                     assignment.userSubmission.status === "draft") && (
//                     <button
//                       onClick={() => {
//                         setSelectedAssignment(assignment);
//                         setShowSubmissionModal(true);
//                       }}
//                       className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
//                     >
//                       Submit Assignment
//                     </button>
//                   )}

//                 {assignment.userEvaluations &&
//                   assignment.userEvaluations.some(
//                     (evaluation) =>
//                       evaluation.status === "assigned" ||
//                       evaluation.status === "in_progress"
//                   ) && (
//                     <button
//                       onClick={() => (window.location.href = "/evaluations")}
//                       className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
//                     >
//                       

//                     </button>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Teacher/Admin-specific content */}
//         {(type === "teacher" || type === "admin") && (
//           <div className="space-y-3">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
//                 <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
//                   Submissions
//                 </h4>
//                 <div className="text-xs text-blue-600 dark:text-blue-400">
//                   <div>
//                     Total: {assignment.submissionStats?.totalSubmissions || 0}
//                   </div>
//                   <div>
//                     Submitted: {assignment.submissionStats?.submittedCount || 0}
//                   </div>
//                   <div>
//                     Pending: {assignment.submissionStats?.pendingCount || 0}
//                   </div>
//                   {(assignment.submissionStats?.lateCount || 0) > 0 && (
//                     <div className="text-red-600 dark:text-red-400">
//                       Late: {assignment.submissionStats.lateCount}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
//                 <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
//                   Evaluations
//                 </h4>
//                 <div className="text-xs text-purple-600 dark:text-purple-400">
//                   <div>
//                     Total: {assignment.evaluationStats?.totalEvaluations || 0}
//                   </div>
//                   <div>
//                     Completed:{" "}
//                     {assignment.evaluationStats?.completedEvaluations || 0}
//                   </div>
//                   <div>
//                     Pending:{" "}
//                     {assignment.evaluationStats?.pendingEvaluations || 0}
//                   </div>
//                   {assignment.evaluationStats?.averageScore && (
//                     <div className="font-medium">
//                       Avg: {assignment.evaluationStats.averageScore.toFixed(1)}%
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between items-center pt-2">
//               <div className="text-xs text-gray-500 dark:text-gray-400">
//                 Created: {new Date(assignment.createdAt).toLocaleDateString()}
//               </div>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => setSelectedAssignment(assignment)}
//                   className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   <EyeIcon className="w-4 h-4 inline mr-1" />
//                   View Details
//                 </button>

//                 <button
//                   onClick={() =>
//                     (window.location.href = `/assignments/${assignment._id}/manage`)
//                   }
//                   className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                 >
//                   <BarChart3Icon className="w-4 h-4 inline mr-1" />
//                   Manage
//                 </button>

//                 {assignment.status === "closed" &&
//                   (assignment.submissionStats?.submittedCount || 0) >= 2 && (
//                     <button
//                       onClick={() => {
//                         setSelectedAssignment(assignment);
//                         setShowEvaluationSetup(true);
//                       }}
//                       className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
//                     >
//                       <ShuffleIcon className="w-4 h-4 inline mr-1" />
//                       Setup Evaluations
//                     </button>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     );
//   };

//   const renderStudentView = () => (
//     <div className="space-y-6">
//       {assignmentData.myAssignments.length === 0 ? (
//         <div className="text-center py-12">
//           <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//             No Assignments Yet
//           </h3>
//           <p className="text-gray-600 dark:text-gray-400">
//             Your assignments will appear here once your instructors create them.
//           </p>
//         </div>
//       ) : (
//         assignmentData.myAssignments.map((assignment) =>
//           renderAssignmentCard(assignment, "student")
//         )
//       )}
//     </div>
//   );

//   const renderTeacherView = () => (
//     <div className="space-y-6">
//       <nav className="-mb-px flex space-x-8">
//         {[
//           {
//             key: "created",
//             label: "📚 My Assignments",
//             count: assignmentData?.createdAssignments.length,
//           },
//           {
//             key: "evaluation_queue",
//             label: "⚡ Setup Evaluations",
//             count: assignmentData.evaluationQueue.length,
//           },
//         ].map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
//               activeTab === tab.key
//                 ? "border-blue-500 text-blue-600 dark:text-blue-400"
//                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
//             }`}
//           >
//             <span>{tab.label}</span>
//             {tab.count > 0 && (
//               <span
//                 className={`px-2 py-1 rounded-full text-xs ${
//                   activeTab === tab.key
//                     ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
//                     : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
//                 }`}
//               >
//                 {tab.count}
//               </span>
//             )}
//           </button>
//         ))}
//       </nav>

//       <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
//         <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
//           Teacher Actions
//         </h3>
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => (window.location.href = "/assignments/create")}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <PlusIcon className="w-4 h-4" />
//             <span>Create Assignment</span>
//           </button>
//           <button
//             onClick={() => (window.location.href = "/evaluations")}
//             className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//           >
//             <UsersIcon className="w-4 h-4" />
//             <span>Review Evaluations</span>
//           </button>
//           <button
//             onClick={() => (window.location.href = "/students")}
//             className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//           >
//             <BarChart3Icon className="w-4 h-4" />
//             <span>Student Analytics</span>
//           </button>
//         </div>
//       </div>

//       {activeTab === "created" && (
//         <div className="space-y-6">
//           {assignmentData.createdAssignments.length === 0 ? (
//             <div className="text-center py-12">
//               <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                 No Assignments Created
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 Start by creating your first assignment for students.
//               </p>
//               <button
//                 onClick={() => (window.location.href = "/assignments/create")}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Create First Assignment
//               </button>
//             </div>
//           ) : (
//             assignmentData.createdAssignments.map((assignment) =>
//               renderAssignmentCard(assignment, "teacher")
//             )
//           )}
//         </div>
//       )}

//       {activeTab === "evaluation_queue" && (
//         <div className="space-y-6">
//           {assignmentData.evaluationQueue.length === 0 ? (
//             <div className="text-center py-12">
//               <ShuffleIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                 No Assignments Ready for Evaluation
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Assignments will appear here when the submission deadline has
//                 passed and peer evaluations can be set up.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
//                 <h4 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
//                   Ready for Peer Evaluation Setup
//                 </h4>
//                 <p className="text-sm text-amber-700 dark:text-amber-300">
//                   These assignments have sufficient submissions and are ready
//                   for peer evaluation configuration.
//                 </p>
//               </div>
//               {assignmentData.evaluationQueue.map((assignment) =>
//                 renderAssignmentCard(assignment, "teacher")
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   const renderAdminView = () => (
//     <div className="space-y-6">
//       <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
//         <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
//           Administrator Assignment Overview
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
//             <h4 className="font-medium text-gray-900 dark:text-white">
//               System Assignments
//             </h4>
//             <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//               {assignmentData.createdAssignments.length}
//             </p>
//           </div>
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
//             <h4 className="font-medium text-gray-900 dark:text-white">
//               Active Evaluations
//             </h4>
//             <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//               {assignmentData.createdAssignments.reduce(
//                 (total: number, assignment: Assignment) =>
//                   total + (assignment.evaluationStats?.totalEvaluations || 0),
//                 0
//               )}
//             </p>
//           </div>
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
//             <h4 className="font-medium text-gray-900 dark:text-white">
//               Platform Health
//             </h4>
//             <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//               98%
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6">
//         {assignmentData.createdAssignments.map((assignment) =>
//           renderAssignmentCard(assignment, "admin")
//         )}
//       </div>
//     </div>
//   );

//   const renderRoleSpecificContent = () => {
//     switch (userRole) {
//       case "teacher":
//         return renderTeacherView();
//       case "admin":
//         return renderAdminView();
//       default:
//         return renderStudentView();
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
//           <p className="text-gray-600 dark:text-gray-400">
//             Loading assignments...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 bg-gray-100 min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border-2 dark:border-gray-500/20 rounded-xl">
//       <div className="mb-6 sm:mb-8">
//         <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3 text-center">
//           <span>
//             <LayersIcon className="w-8 h-8 text-green-400 dark:text-green-500/80 inline-block" />{" "}
//             {userRole === "teacher"
//               ? "Assignment Management Dashboard"
//               : userRole === "admin"
//               ? "System Assignment Overview"
//               : "My Assignments & Peer Evaluations"}
//           </span>
//         </div>
//         <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
//           {userRole === "teacher"
//             ? "Create assignments and manage peer evaluation workflows"
//             : userRole === "admin"
//             ? "Monitor platform-wide assignment and evaluation activities"
//             : "Complete assignments and participate in peer evaluations"}
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
//           <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
//         </div>
//       )}

//       {renderRoleSpecificContent()}

//       {/* Submission Modal */}
//       {showSubmissionModal && selectedAssignment && (
//         <SubmissionModal
//           assignment={selectedAssignment}
//           onSubmit={handleSubmitAssignment}
//           onClose={() => {
//             setShowSubmissionModal(false);
//             setSelectedAssignment(null);
//           }}
//         />
//       )}

//       {/* Evaluation Setup Modal */}
//       {showEvaluationSetup && selectedAssignment && (
//         <EvaluationSetupModal
//           assignment={selectedAssignment}
//           onSetup={handleTriggerEvaluations}
//           onClose={() => {
//             setShowEvaluationSetup(false);
//             setSelectedAssignment(null);
//           }}
//         />
//       )}

//       {/* Skill Suggestion Modal (for students only) */}
//       {userRole === "student" && (
//         <SkillSuggestionModal
//           isOpen={skillSuggestion.isModalOpen}
//           onClose={skillSuggestion.handleCloseModal}
//           suggestedSkills={
//             skillSuggestion.currentSuggestion?.suggestedSkills || []
//           }
//           assignmentTitle={
//             skillSuggestion.currentSuggestion?.assignmentTitle || ""
//           }
//           onAddSkills={skillSuggestion.handleAddSkills}
//         />
//       )}
//     </div>
//   );
// };

// // Submission Modal Component
// const SubmissionModal: React.FC<{
//   assignment: Assignment;
//   onSubmit: (
//     assignmentId: string,
//     data: { content: string; attachments: File[] }
//   ) => void;
//   onClose: () => void;
// }> = ({ assignment, onSubmit, onClose }) => {
//   const [content, setContent] = useState("");
//   const [attachments, setAttachments] = useState<File[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     if (!content.trim()) {
//       alert("Please provide submission content");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await onSubmit(assignment._id, {
//         content,
//         attachments,
//       });
//     } catch (error) {
//       console.error("Error submitting:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setAttachments(files);
//     }
//   };

//   const removeFile = (index: number) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Submit Assignment
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">
//                 {assignment.title}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Course: {assignment.courseId?.title || assignment.subject}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
//             <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
//               Assignment Details
//             </h3>
//             <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
//               <div>Due: {new Date(assignment.dueDate).toLocaleString()}</div>
//               <div>Max Score: {assignment.maxScore} points</div>
//               {assignment.submissionSettings?.minWordCount && (
//                 <div>
//                   Min Words: {assignment.submissionSettings.minWordCount}
//                 </div>
//               )}
//               {assignment.submissionSettings?.maxWordCount && (
//                 <div>
//                   Max Words: {assignment.submissionSettings.maxWordCount}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Submission Content *
//             </label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Enter your assignment submission content..."
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               rows={8}
//               required
//               disabled={isSubmitting}
//             />
//             <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//               Word count:{" "}
//               {
//                 content
//                   .trim()
//                   .split(/\s+/)
//                   .filter((word) => word.length > 0).length
//               }
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Attachments{" "}
//               {assignment.submissionSettings?.requireFileAttachment &&
//                 "(Required)"}
//             </label>
//             <input
//               type="file"
//               multiple
//               onChange={handleFileChange}
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               disabled={isSubmitting}
//               accept={assignment.submissionSettings?.allowedFileTypes
//                 ?.map((type) => `.${type}`)
//                 .join(",")}
//             />
//             {assignment.submissionSettings?.allowedFileTypes && (
//               <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                 Allowed types:{" "}
//                 {assignment.submissionSettings.allowedFileTypes.join(", ")}
//               </div>
//             )}
//             {assignment.submissionSettings?.maxFileSize && (
//               <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                 Max size:{" "}
//                 {Math.round(
//                   assignment.submissionSettings.maxFileSize / (1024 * 1024)
//                 )}
//                 MB per file
//               </div>
//             )}

//             {attachments.length > 0 && (
//               <div className="mt-3 space-y-2">
//                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Selected Files:
//                 </p>
//                 {attachments.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border"
//                   >
//                     <div className="text-sm text-gray-700 dark:text-gray-300">
//                       <div className="font-medium">{file.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {(file.size / 1024 / 1024).toFixed(2)} MB
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => removeFile(index)}
//                       disabled={isSubmitting}
//                       className="text-red-500 hover:text-red-700 disabled:opacity-50"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {assignment.description && (
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//               <h4 className="font-medium text-gray-900 dark:text-white mb-2">
//                 Assignment Description
//               </h4>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {assignment.description}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             disabled={isSubmitting}
//             className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!content.trim() || isSubmitting}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
//           >
//             {isSubmitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
//             <span>{isSubmitting ? "Submitting..." : "Submit Assignment"}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Evaluation Setup Modal Component
// const EvaluationSetupModal: React.FC<{
//   assignment: Assignment;
//   onSetup: (assignmentId: string) => void;
//   onClose: () => void;
// }> = ({ assignment, onSetup, onClose }) => {
//   const [settings, setSettings] = useState({
//     evaluationsPerSubmission: 2,
//     maxEvaluationsPerUser: 3,
//     evaluationDeadlineDays: 7,
//     allowSelfEvaluation: false,
//     randomizeAssignment: true,
//     balanceWorkload: true,
//   });
//   const [isSettingUp, setIsSettingUp] = useState(false);

//   const handleSetup = async () => {
//     setIsSettingUp(true);
//     try {
//       await onSetup(assignment._id);
//     } catch (error) {
//       console.error("Error setting up evaluations:", error);
//     } finally {
//       setIsSettingUp(false);
//     }
//   };

//   const totalEvaluations =
//     (assignment.submissionStats?.submittedCount || 0) *
//     settings.evaluationsPerSubmission;
//   const avgEvaluationsPerUser = assignment.submissionStats?.submittedCount
//     ? Math.ceil(totalEvaluations / assignment.submissionStats.submittedCount)
//     : 0;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Setup Peer Evaluations
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">
//                 {assignment.title}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Course: {assignment.courseId?.title || assignment.subject}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               disabled={isSettingUp}
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
//             <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
//               <ShuffleIcon className="w-5 h-5 mr-2" />
//               Graph Coloring Assignment Algorithm
//             </h3>
//             <p className="text-sm text-blue-700 dark:text-blue-300">
//               Our advanced algorithm will automatically assign peer evaluations
//               using graph coloring theory to ensure optimal distribution while
//               avoiding conflicts and balancing workload across all students.
//             </p>
//           </div>

//           <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 dark:text-white mb-3">
//               Assignment Statistics
//             </h4>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Total Submissions:
//                 </span>
//                 <span className="ml-2 font-medium text-gray-900 dark:text-white">
//                   {assignment.submissionStats?.submittedCount || 0}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Late Submissions:
//                 </span>
//                 <span className="ml-2 font-medium text-gray-900 dark:text-white">
//                   {assignment.submissionStats?.lateCount || 0}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Due Date:
//                 </span>
//                 <span className="ml-2 font-medium text-gray-900 dark:text-white">
//                   {new Date(assignment.dueDate).toLocaleDateString()}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Max Score:
//                 </span>
//                 <span className="ml-2 font-medium text-gray-900 dark:text-white">
//                   {assignment.maxScore} points
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Evaluations per Submission
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 max="5"
//                 value={settings.evaluationsPerSubmission}
//                 onChange={(e) =>
//                   setSettings((prev) => ({
//                     ...prev,
//                     evaluationsPerSubmission: parseInt(e.target.value) || 1,
//                   }))
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
//                 disabled={isSettingUp}
//               />
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 How many students will evaluate each submission
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Max Evaluations per User
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 max="10"
//                 value={settings.maxEvaluationsPerUser}
//                 onChange={(e) =>
//                   setSettings((prev) => ({
//                     ...prev,
//                     maxEvaluationsPerUser: parseInt(e.target.value) || 1,
//                   }))
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
//                 disabled={isSettingUp}
//               />
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 Maximum evaluations assigned to any single student
//               </p>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Evaluation Deadline (Days from now)
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 max="30"
//                 value={settings.evaluationDeadlineDays}
//                 onChange={(e) =>
//                   setSettings((prev) => ({
//                     ...prev,
//                     evaluationDeadlineDays: parseInt(e.target.value) || 7,
//                   }))
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
//                 disabled={isSettingUp}
//               />
//             </div>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-medium text-gray-900 dark:text-white">
//               Advanced Options
//             </h4>

//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={settings.randomizeAssignment}
//                 onChange={(e) =>
//                   setSettings((prev) => ({
//                     ...prev,
//                     randomizeAssignment: e.target.checked,
//                   }))
//                 }
//                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 disabled={isSettingUp}
//               />
//               <span className="text-sm text-gray-700 dark:text-gray-300">
//                 Randomize assignment within workload groups
//               </span>
//             </label>

//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={settings.balanceWorkload}
//                 onChange={(e) =>
//                   setSettings((prev) => ({
//                     ...prev,
//                     balanceWorkload: e.target.checked,
//                   }))
//                 }
//                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 disabled={isSettingUp}
//               />
//               <span className="text-sm text-gray-700 dark:text-gray-300">
//                 Balance workload across evaluators
//               </span>
//             </label>

//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={settings.allowSelfEvaluation}
//                 onChange={(e) =>
//                   setSettings((prev) => ({
//                     ...prev,
//                     allowSelfEvaluation: e.target.checked,
//                   }))
//                 }
//                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 disabled={isSettingUp}
//               />
//               <span className="text-sm text-gray-700 dark:text-gray-300">
//                 Allow self-evaluation (not recommended)
//               </span>
//             </label>
//           </div>

//           <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
//             <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
//               Assignment Preview
//             </h4>
//             <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
//               <div>
//                 • {assignment.submissionStats?.submittedCount || 0} submissions
//                 ready for evaluation
//               </div>
//               <div>• {totalEvaluations} total evaluations will be created</div>
//               <div>
//                 • ~{avgEvaluationsPerUser} evaluations per student (avg)
//               </div>
//               <div>
//                 • Evaluations due in {settings.evaluationDeadlineDays} days
//               </div>
//               <div>
//                 •{" "}
//                 {settings.balanceWorkload
//                   ? "Workload balanced"
//                   : "Standard assignment"}
//                 {settings.randomizeAssignment && " with randomization"}
//               </div>
//             </div>
//           </div>

//           {(assignment.submissionStats?.submittedCount || 0) < 2 && (
//             <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
//               <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
//                 ⚠️ Insufficient Submissions
//               </h4>
//               <p className="text-sm text-red-700 dark:text-red-300">
//                 You need at least 2 submissions to set up peer evaluations.
//                 Currently have {assignment.submissionStats?.submittedCount || 0}{" "}
//                 submissions.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             disabled={isSettingUp}
//             className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSetup}
//             disabled={
//               isSettingUp ||
//               (assignment.submissionStats?.submittedCount || 0) < 2
//             }
//             className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
//           >
//             {isSettingUp && <Loader2Icon className="w-4 h-4 animate-spin" />}
//             <span>
//               {isSettingUp ? "Setting up..." : "Setup Peer Evaluations"}
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignmentPage;

// ========================================================================================//

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  // ArrowLeft,
  User,
  Layers,
  Loader2,
  Plus,
  BookOpen,
  Users,
  // Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Target,
  Eye,
  // Upload,
  Calendar,
  BarChart3,
  // Award,
  Shuffle,
} from "lucide-react";
import SkillSuggestionModal from "../components/SkillSuggestionModal";
import { useSkillSuggestion } from "../hooks/useSkillSuggestion";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
// import { apiService } from "../services/api";

interface Assignment {
  _id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  createdAt: string;
  status: "draft" | "published" | "closed" | "evaluation_phase" | "completed";
  tags: string[];
  maxScore: number;
  instructorId: string;
  instructor?: {
    userName: string;
    userEmail: string;
  };

  // Submission tracking
  submissionStats: {
    totalSubmissions: number;
    submittedCount: number;
    pendingCount: number;
    lateCount: number;
  };

  // Evaluation tracking
  evaluationStats: {
    totalEvaluations: number;
    completedEvaluations: number;
    pendingEvaluations: number;
    averageScore?: number;
  };

  // User-specific data
  userSubmission?: {
    _id: string;
    status:
      | "draft"
      | "submitted"
      | "under_evaluation"
      | "evaluated"
      | "finalized";
    submittedAt?: string;
    score?: number;
    grade?: string;
    feedback?: string;
  };

  userEvaluations?: Array<{
    _id: string;
    status: "assigned" | "in_progress" | "submitted" | "reviewed";
    dueDate: string;
    submitterName: string;
  }>;
}

interface AssignmentData {
  myAssignments: Assignment[]; // Student view
  createdAssignments: Assignment[]; // Teacher view
  evaluationQueue: Assignment[]; // Assignments needing evaluation setup
}

const AssignmentPage: React.FC = () => {
  const { state, updateProfile } = useAuth();
  const [userSkills, setUserSkills] = useState<string[]>(
    Array.isArray(state.user?.userSkills)
      ? state.user.userSkills.map((skill: any) =>
          typeof skill === "string" ? skill : skill.name
        )
      : []
  );
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    myAssignments: [],
    createdAssignments: [],
    evaluationQueue: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("my_assignments");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showEvaluationSetup, setShowEvaluationSetup] = useState(false);

  const userRole = state.user?.userRole || "student";

  // Skill suggestion hook
  const skillSuggestion = useSkillSuggestion({
    userSkills,
    onSkillsAdded: async (newSkills) => {
      const updatedSkills = [...userSkills, ...newSkills];
      setUserSkills(updatedSkills);

      try {
        await updateProfile({
          userSkills: updatedSkills.map((skill) => ({
            name: skill,
            level: "beginner",
            category: "general",
            verified: false,
          })),
        });
        console.log("Added skills to profile:", newSkills);
      } catch (error) {
        console.error("Failed to update skills in profile:", error);
      }
    },
  });

  useEffect(() => {
    if (state.user?.userSkills) {
      setUserSkills(
        Array.isArray(state.user.userSkills)
          ? state.user.userSkills.map((skill: any) =>
              typeof skill === "string" ? skill : skill.name
            )
          : []
      );
    }
  }, [state.user]);

  useEffect(() => {
    fetchAssignments();
  }, [state.user, userRole]);
const completeEvaluation = async (assignmentId: string) => {
  try {
    const res = await axios.patch(`/api/v1/assignments/${assignmentId}`, {
      status: "completed",
    });
    console.log("Marked as completed:", res.data);

    // OPTIONAL: refresh assignment list if needed
    // await fetchAssignments();  ← only if you have such a function

  } catch (error) {
    console.error("Error completing evaluation:", error);
  }
};

  
  const fetchAssignments = async () => {
    if (!state.user) return;

    try {
      setIsLoading(true);

      // Mock data based on user role
      let mockData: AssignmentData;

      switch (userRole) {
        case "teacher":
          mockData = {
            // TODO: Replace with real API calls
            myAssignments: [],
            createdAssignments: [
              {
                _id: "assign1",
                title: "React Component Architecture",
                subject: "Web Development",
                description:
                  "Design and implement a scalable React component system with proper state management and performance optimization.",
                dueDate: "2025-07-20T23:59:59Z",
                createdAt: "2025-07-01T10:00:00Z",
                status: "evaluation_phase",
                tags: ["react", "javascript", "frontend", "architecture"],
                maxScore: 100,
                instructorId: state.user._id,
                instructor: {
                  userName: state.user.userName,
                  userEmail: state.user.userEmail,
                },
                submissionStats: {
                  totalSubmissions: 25,
                  submittedCount: 23,
                  pendingCount: 2,
                  lateCount: 1,
                },
                evaluationStats: {
                  totalEvaluations: 46,
                  completedEvaluations: 18,
                  pendingEvaluations: 28,
                  averageScore: 85.2,
                },
              },
              {
                _id: "assign2",
                title: "Database Optimization Strategies",
                subject: "Database Systems",
                description:
                  "Analyze and propose optimization strategies for large-scale database systems.",
                dueDate: "2025-07-25T23:59:59Z",
                createdAt: "2025-07-05T14:30:00Z",
                status: "published",
                tags: ["database", "sql", "performance", "optimization"],
                maxScore: 100,
                instructorId: state.user._id,
                submissionStats: {
                  totalSubmissions: 30,
                  submittedCount: 15,
                  pendingCount: 15,
                  lateCount: 0,
                },
                evaluationStats: {
                  totalEvaluations: 0,
                  completedEvaluations: 0,
                  pendingEvaluations: 0,
                },
              },
            ],
            evaluationQueue: [
              {
                _id: "assign1",
                title: "React Component Architecture",
                subject: "Web Development",
                description: "Ready for peer evaluation assignment",
                dueDate: "2025-07-20T23:59:59Z",
                createdAt: "2025-07-01T10:00:00Z",
                status: "closed",
                tags: ["react", "javascript"],
                maxScore: 100,
                instructorId: state.user._id,
                submissionStats: {
                  totalSubmissions: 25,
                  submittedCount: 23,
                  pendingCount: 0,
                  lateCount: 2,
                },
                evaluationStats: {
                  totalEvaluations: 0,
                  completedEvaluations: 0,
                  pendingEvaluations: 0,
                },
              },
            ],
          };
          break;

        case "admin":
          mockData = {
            // TODO: Replace with real API calls
            myAssignments: [],
            createdAssignments: [
              {
                _id: "admin1",
                title: "Platform Usage Analysis",
                subject: "System Administration",
                description:
                  "Comprehensive analysis of platform usage metrics and user engagement patterns.",
                dueDate: "2025-07-30T23:59:59Z",
                createdAt: "2025-07-10T09:00:00Z",
                status: "published",
                tags: ["analytics", "reporting", "admin"],
                maxScore: 100,
                instructorId: state.user._id,
                submissionStats: {
                  totalSubmissions: 10,
                  submittedCount: 3,
                  pendingCount: 7,
                  lateCount: 0,
                },
                evaluationStats: {
                  totalEvaluations: 0,
                  completedEvaluations: 0,
                  pendingEvaluations: 0,
                },
              },
            ],
            evaluationQueue: [],
          };
          break;

        default: // student
          mockData = {
            // TODO: Replace with real API calls
            myAssignments: [
              {
                _id: "assign1",
                title: "React Component Architecture",
                subject: "Web Development",
                description:
                  "Design and implement a scalable React component system with proper state management.",
                dueDate: "2025-07-20T23:59:59Z",
                createdAt: "2025-07-01T10:00:00Z",
                status: "evaluation_phase",
                tags: ["react", "javascript", "frontend", "architecture"],
                maxScore: 100,
                instructorId: "teacher1",
                instructor: {
                  userName: "Dr. Sarah Johnson",
                  userEmail: "sarah.johnson@university.edu",
                },
                submissionStats: {
                  totalSubmissions: 25,
                  submittedCount: 23,
                  pendingCount: 2,
                  lateCount: 1,
                },
                evaluationStats: {
                  totalEvaluations: 46,
                  completedEvaluations: 18,
                  pendingEvaluations: 28,
                },
                userSubmission: {
                  _id: "sub1",
                  status: "under_evaluation",
                  submittedAt: "2025-07-18T16:30:00Z",
                },
                userEvaluations: [
                  {
                    _id: "eval1",
                    status: "assigned",
                    dueDate: "2025-07-22T23:59:59Z",
                    submitterName: "Anonymous Student A",
                  },
                  {
                    _id: "eval2",
                    status: "in_progress",
                    dueDate: "2025-07-22T23:59:59Z",
                    submitterName: "Anonymous Student B",
                  },
                ],
              },
              {
                _id: "assign2",
                title: "Database Optimization Strategies",
                subject: "Database Systems",
                description:
                  "Analyze and propose optimization strategies for large-scale database systems.",
                dueDate: "2025-07-25T23:59:59Z",
                createdAt: "2025-07-05T14:30:00Z",
                status: "published",
                tags: ["database", "sql", "performance", "optimization"],
                maxScore: 100,
                instructorId: "teacher2",
                instructor: {
                  userName: "Prof. Michael Chen",
                  userEmail: "michael.chen@university.edu",
                },
                submissionStats: {
                  totalSubmissions: 30,
                  submittedCount: 15,
                  pendingCount: 15,
                  lateCount: 0,
                },
                evaluationStats: {
                  totalEvaluations: 0,
                  completedEvaluations: 0,
                  pendingEvaluations: 0,
                },
                userSubmission: {
                  _id: "sub2",
                  status: "draft",
                },
                userEvaluations: [],
              },
              {
                _id: "assign3",
                title: "Machine Learning Model Implementation",
                subject: "Data Science",
                description:
                  "Implement and evaluate a machine learning model for classification tasks.",
                dueDate: "2025-07-15T23:59:59Z",
                createdAt: "2025-06-20T12:00:00Z",
                status: "completed",
                tags: [
                  "machine-learning",
                  "python",
                  "classification",
                  "data-science",
                ],
                maxScore: 100,
                instructorId: "teacher3",
                instructor: {
                  userName: "Dr. Emily Rodriguez",
                  userEmail: "emily.rodriguez@university.edu",
                },
                submissionStats: {
                  totalSubmissions: 22,
                  submittedCount: 22,
                  pendingCount: 0,
                  lateCount: 3,
                },
                evaluationStats: {
                  totalEvaluations: 44,
                  completedEvaluations: 44,
                  pendingEvaluations: 0,
                  averageScore: 87.5,
                },
                userSubmission: {
                  _id: "sub3",
                  status: "finalized",
                  submittedAt: "2025-07-14T20:15:00Z",
                  score: 92,
                  grade: "A",
                  feedback:
                    "Excellent implementation with innovative approaches to the classification problem.",
                },
                userEvaluations: [
                  {
                    _id: "eval3",
                    status: "submitted",
                    dueDate: "2025-07-18T23:59:59Z",
                    submitterName: "Anonymous Student C",
                  },
                ],
              },
            ],
            createdAssignments: [],
            evaluationQueue: [],
          };
      }

      // Simulate API call delay
      // await new Promise((resolve) => setTimeout(resolve, 800));

      setAssignmentData(mockData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAssignment = async (
    assignmentId: string,
    submissionData: any
  ) => {
    try {
      console.log("📝 Submitting assignment:", submissionData);

      // Update local state with submission including Cloudinary URL
      setAssignmentData((prev) => ({
        ...prev,
        myAssignments: prev.myAssignments.map((assignment) =>
          assignment._id === assignmentId
            ? {
                ...assignment,
                userSubmission: {
                  _id: `submission_${Date.now()}`,
                  status: "submitted",
                  submittedAt: new Date().toISOString(),
                  cloudinaryUrl: submissionData.cloudinaryUrl,
                  filename: submissionData.filename,
                  content: submissionData.content,
                },
              }
            : assignment
        ),
      }));

      // Show success message with Cloudinary URL
      alert(`✅ Assignment submitted successfully!\n📁 File uploaded: ${submissionData.filename}\n🔗 Cloudinary URL: ${submissionData.cloudinaryUrl}`);

      // Trigger skill suggestion
      const assignment = assignmentData.myAssignments.find(
        (a) => a._id === assignmentId
      );
      if (assignment) {
        skillSuggestion.triggerSkillSuggestion({
          id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          tags: assignment.tags,
        });
      }

      setShowSubmissionModal(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error("❌ Error submitting assignment:", error);
      setError("Failed to submit assignment");
    }
  };

  const handleTriggerEvaluations = async (assignmentId: string) => {
    try {
      // TODO: Trigger peer evaluation assignment
      /*
      await apiService.post(`/assignments/${assignmentId}/trigger-evaluations`);
      */

      console.log("Triggering peer evaluations for assignment:", assignmentId);

      // Update local state
      setAssignmentData((prev) => ({
        ...prev,
        createdAssignments: prev.createdAssignments.map((assignment) =>
          assignment._id === assignmentId
            ? { ...assignment, status: "evaluation_phase" }
            : assignment
        ),
        evaluationQueue: prev.evaluationQueue.filter(
          (assignment) => assignment._id !== assignmentId
        ),
      }));

      setShowEvaluationSetup(false);
    } catch (error) {
      console.error("Error triggering evaluations:", error);
      setError("Failed to trigger peer evaluations");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="w-5 h-5 text-gray-500" />;
      case "published":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "closed":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "evaluation_phase":
        return <Users className="w-5 h-5 text-purple-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      published:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      closed:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      evaluation_phase:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderAssignmentCard = (
    assignment: Assignment,
    type: "student" | "teacher" | "admin"
  ) => {
    const daysRemaining = getDaysRemaining(assignment.dueDate);
    const isOverdue = daysRemaining < 0;
    const isUrgent = daysRemaining <= 2 && daysRemaining >= 0;

    return (
      <motion.div
        key={assignment._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl shadow-md p-6 border-l-4 hover:shadow-xl transition-all duration-300 dark:bg-gray-800 ${
          isOverdue
            ? "border-red-500"
            : isUrgent
            ? "border-amber-500"
            : "border-indigo-500"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {assignment.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {assignment.subject}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {type === "student" && assignment.instructor && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{assignment.instructor.userName}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{assignment.maxScore} points</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(assignment.status)}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  assignment.status
                )}`}
              >
                {assignment.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {daysRemaining >= 0 && assignment.status === "published" && (
              <div
                className={`text-xs px-2 py-1 rounded ${
                  isUrgent
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {daysRemaining === 0
                  ? "Due today"
                  : `${daysRemaining} days left`}
              </div>
            )}

            {isOverdue && assignment.status === "published" && (
              <div className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {Math.abs(daysRemaining)} days overdue
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {assignment.description}
        </p>

        {/* Tags */}
        {assignment.tags && assignment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {assignment.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Student-specific content */}
        {type === "student" && (
          <div className="space-y-3">
            {/* Submission Status */}
            {assignment.userSubmission && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Submission
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      assignment.userSubmission.status
                    )}`}
                  >
                    {assignment.userSubmission.status
                      .replace("_", " ")
                      .toUpperCase()}
                  </span>
                </div>

                {assignment.userSubmission.submittedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Submitted:{" "}
                    {new Date(
                      assignment.userSubmission.submittedAt
                    ).toLocaleDateString()}
                  </p>
                )}

                {/* Display submitted file */}
                {(assignment.userSubmission as any)?.cloudinaryUrl && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 dark:text-green-400">📄</span>
                        <span className="text-xs font-medium text-green-900 dark:text-green-100">
                          {(assignment.userSubmission as any)?.filename || 'Submitted File'}
                        </span>
                      </div>
                      <a
                        href={(assignment.userSubmission as any).cloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        View File
                      </a>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 break-all">
                      🔗 {(assignment.userSubmission as any).cloudinaryUrl}
                    </p>
                  </div>
                )}

                {assignment.userSubmission.score !== undefined && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Score:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {assignment.userSubmission.score}/{assignment.maxScore}
                      </span>
                      {assignment.userSubmission.grade && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-xs font-medium">
                          {assignment.userSubmission.grade}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {assignment.userSubmission.feedback && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                    "{assignment.userSubmission.feedback}"
                  </p>
                )}
              </div>
            )}

            {/* Evaluation Assignments */}
            {assignment.userEvaluations &&
              assignment.userEvaluations.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                    Your Evaluation Tasks ({assignment.userEvaluations.length})
                  </h4>
                  <div className="space-y-1">
                    {assignment.userEvaluations.map((evaluation, index) => (
                      <div
                        key={evaluation._id}
                        className="flex justify-between items-center text-xs"
                      >
                        <span className="text-purple-600 dark:text-purple-400">
                          {evaluation.submitterName}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${getStatusColor(
                            evaluation.status
                          )}`}
                        >
                          {evaluation.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Created: {new Date(assignment.createdAt).toLocaleDateString()}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedAssignment(assignment)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  View Details
                </button>

                {assignment.status === "published" &&
                  (!assignment.userSubmission ||
                    assignment.userSubmission.status === "draft") && (
                    <button
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowSubmissionModal(true);
                      }}
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    >
                      Submit Assignment
                    </button>
                  )}

                {assignment.userEvaluations &&
                  assignment.userEvaluations.some(
                    (evaluations) =>
                      evaluations.status === "assigned" ||
                      evaluations.status === "in_progress"
                  ) && (
                    
                     <button
  onClick={() => completeEvaluation(assignment._id)}
  className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
>
  Complete Evaluation
</button>
 
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Teacher-specific content */}
        {(type === "teacher" || type === "admin") && (
          <div className="space-y-3">
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Submissions
                </h4>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  <div>
                    Total: {assignment.submissionStats.totalSubmissions}
                  </div>
                  <div>
                    Submitted: {assignment.submissionStats.submittedCount}
                  </div>
                  <div>Pending: {assignment.submissionStats.pendingCount}</div>
                  {assignment.submissionStats.lateCount > 0 && (
                    <div className="text-red-600 dark:text-red-400">
                      Late: {assignment.submissionStats.lateCount}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                  Evaluations
                </h4>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  <div>
                    Total: {assignment.evaluationStats.totalEvaluations}
                  </div>
                  <div>
                    Completed: {assignment.evaluationStats.completedEvaluations}
                  </div>
                  <div>
                    Pending: {assignment.evaluationStats.pendingEvaluations}
                  </div>
                  {assignment.evaluationStats.averageScore && (
                    <div className="font-medium">
                      Avg: {assignment.evaluationStats.averageScore.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Created: {new Date(assignment.createdAt).toLocaleDateString()}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedAssignment(assignment)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  View Details
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `/assignments/${assignment._id}/manage`)
                  }
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Manage
                </button>

                {assignment.status === "closed" &&
                  assignment.submissionStats.submittedCount >= 2 && (
                    <button
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowEvaluationSetup(true);
                      }}
                      className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      <Shuffle className="w-4 h-4 inline mr-1" />
                      Setup Evaluations
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case "teacher":
        return renderTeacherView();
      case "admin":
        return renderAdminView();
      default:
        return renderStudentView();
    }
  };

  const renderStudentView = () => (
    <div className="space-y-6">
      {assignmentData.myAssignments.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Assignments Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your assignments will appear here once your instructors create them.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignmentData.myAssignments.map((assignment) =>
            renderAssignmentCard(assignment, "student")
          )}
        </div>
      )}
    </div>
  );

  const renderTeacherView = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            {
              key: "created",
              label: "📚 My Assignments",
              count: assignmentData.createdAssignments.length,
            },
            {
              key: "evaluation_queue",
              label: "⚡ Setup Evaluations",
              count: assignmentData.evaluationQueue.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Teacher Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => (window.location.href = "/assignments/create")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
          <button
            onClick={() => (window.location.href = "/evaluations")}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Review Evaluations</span>
          </button>
          <button
            onClick={() => (window.location.href = "/students")}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Student Analytics</span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "created" && (
        <div className="space-y-6">
          {assignmentData.createdAssignments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Assignments Created
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by creating your first assignment for students.
              </p>
              <button
                onClick={() => (window.location.href = "/assignments/create")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Assignment
              </button>
            </div>
          ) : (
            assignmentData.createdAssignments.map((assignment) =>
              renderAssignmentCard(assignment, "teacher")
            )
          )}
        </div>
      )}

      {activeTab === "evaluation_queue" && (
        <div className="space-y-6">
          {assignmentData.evaluationQueue.length === 0 ? (
            <div className="text-center py-12">
              <Shuffle className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Assignments Ready for Evaluation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Assignments will appear here when the submission deadline has
                passed and peer evaluations can be set up.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
                  Ready for Peer Evaluation Setup
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  These assignments have closed for submissions and are ready
                  for peer evaluation assignment using our graph coloring
                  algorithm.
                </p>
              </div>
              {assignmentData.evaluationQueue.map((assignment) =>
                renderAssignmentCard(assignment, "teacher")
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-6">
      {/* Admin Overview */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
          Administrator Assignment Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 dark:text-white">
              System Assignments
            </h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {assignmentData.createdAssignments.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Active Evaluations
            </h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              156
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Platform Health
            </h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              98%
            </p>
          </div>
        </div>
      </div>

      {/* Admin Assignments */}
      <div className="space-y-6">
        {assignmentData.createdAssignments.map((assignment) =>
          renderAssignmentCard(assignment, "admin")
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border-2 dark:border-gray-500/20 rounded-xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3 text-center">
          <span>
            <Layers className="w-8 h-8 text-green-400 dark:text-green-500/80 inline-block" />{" "}
            {userRole === "teacher"
              ? "Assignment Management Dashboard"
              : userRole === "admin"
              ? "System Assignment Overview"
              : "My Assignments & Peer Evaluations"}
          </span>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
          {userRole === "teacher"
            ? "Create assignments and manage peer evaluation workflows"
            : userRole === "admin"
            ? "Monitor platform-wide assignment and evaluation activities"
            : "Complete assignments and participate in peer evaluations"}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {renderRoleSpecificContent()}

      {/* Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <SubmissionModal
          assignment={selectedAssignment}
          onSubmit={handleSubmitAssignment}
          onClose={() => {
            setShowSubmissionModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {/* Evaluation Setup Modal */}
      {showEvaluationSetup && selectedAssignment && (
        <EvaluationSetupModal
          assignment={selectedAssignment}
          onSetup={handleTriggerEvaluations}
          onClose={() => {
            setShowEvaluationSetup(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {/* Skill Suggestion Modal (for students only) */}
      {userRole === "student" && (
        <SkillSuggestionModal
          isOpen={skillSuggestion.isModalOpen}
          onClose={skillSuggestion.handleCloseModal}
          suggestedSkills={
            skillSuggestion.currentSuggestion?.suggestedSkills || []
          }
          assignmentTitle={
            skillSuggestion.currentSuggestion?.assignmentTitle || ""
          }
          onAddSkills={skillSuggestion.handleAddSkills}
        />
      )}
    </div>
  );
};

// Submission Modal Component with Cloudinary Integration
const SubmissionModal: React.FC<{
  assignment: Assignment;
  onSubmit: (assignmentId: string, data: any) => void;
  onClose: () => void;
}> = ({ assignment, onSubmit, onClose }) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log("🔄 SubmissionModal state changed:", {
      hasContent: !!content.trim(),
      selectedFile: selectedFile?.name || null,
      isSubmitting,
      buttonDisabled: isSubmitting || !content.trim() || !selectedFile
    });
  }, [content, selectedFile, isSubmitting]);

  // Keyboard support for file removal
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (selectedFile && !isSubmitting) {
        if (event.key === 'Delete' && event.shiftKey) {
          event.preventDefault();
          handleRemoveFile();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedFile, isSubmitting]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("🔍 File selected:", file);
    
    if (file) {
      console.log("📄 File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2)
      });

      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size must be less than 50MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/zip",
      ];

      console.log("🔍 File type validation:", {
        fileType: file.type,
        isAllowed: allowedTypes.includes(file.type),
        allowedTypes
      });

      if (!allowedTypes.includes(file.type)) {
        alert("File type not supported. Please upload PDF, DOC, DOCX, TXT, images, or ZIP files.");
        return;
      }

      console.log("✅ File accepted, setting selectedFile");
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    const confirmed = window.confirm(`Are you sure you want to remove "${selectedFile?.name}"? This action cannot be undone.`);
    
    if (confirmed) {
      console.log("🗑️ Removing selected file:", selectedFile?.name);
      setSelectedFile(null);
      setUploadProgress(0); // Reset upload progress if any
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      console.log("✅ File removed successfully");
    } else {
      console.log("❌ File removal cancelled by user");
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Please provide submission content");
      return;
    }

    if (!selectedFile) {
      alert("Please select a file to submit");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // First, upload the file to get the Cloudinary URL
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("📤 Uploading file to backend...");
      
      const uploadResponse = await axios.post("http://localhost:8024/api/v1/v1/upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      console.log("✅ File upload response:", uploadResponse.data);

      if (!uploadResponse.data.success || !uploadResponse.data.data) {
        throw new Error("Failed to upload file");
      }

      const fileData = uploadResponse.data.data;

      // Create submission with file attachment
      const submissionPayload = {
        assignmentId: assignment._id,
        content: content.trim(),
        attachments: [
          {
            filename: fileData.filename || selectedFile.name,
            originalName: fileData.originalName || selectedFile.name,
            url: fileData.url,
            size: fileData.size || selectedFile.size,
            mimetype: fileData.mimetype || selectedFile.type,
          },
        ],
      };

      console.log("📝 Creating submission...", submissionPayload);

      // Call the parent onSubmit with the submission data including Cloudinary URL
      onSubmit(assignment._id, {
        content: content.trim(),
        cloudinaryUrl: fileData.url,
        filename: selectedFile.name,
        submissionPayload,
      });

      alert("Assignment submitted successfully!");
      
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit assignment";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📝 Submit Assignment
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {assignment.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Description */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Assignment Description</h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">{assignment.description}</p>
          </div>

          {/* Submission Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💬 Submission Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe your solution, approach, or any additional information about your submission..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
              rows={6}
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📎 Upload Assignment File *
            </label>
            
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  disabled={isSubmitting}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                >
                  <span>📁</span>
                  <span>Choose File</span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  PDF, DOC, DOCX, TXT, Images, or ZIP files (max 50MB)
                </p>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">📄</span>
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">{selectedFile.name}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isSubmitting}
                      className="flex items-center space-x-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
                      title="Change file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-xs">Change</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={isSubmitting}
                      className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-xs">Remove</span>
                    </button>
                  </div>
                </div>
                
                {/* File details section */}
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 dark:text-green-400">Type:</span>
                      <span className="ml-2 text-green-800 dark:text-green-200">{selectedFile.type || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">Size:</span>
                      <span className="ml-2 text-green-800 dark:text-green-200">{formatFileSize(selectedFile.size)}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    💡 Tip: Press <kbd className="bg-green-100 dark:bg-green-800 px-1 rounded">Shift+Delete</kbd> to remove file quickly
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Uploading...</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">🔍 Debug Info</h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <div>Content: {content.trim() ? `"${content.substring(0, 30)}..."` : "❌ Empty"}</div>
              <div>File: {selectedFile ? `✅ ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB)` : "❌ No file selected"}</div>
              <div>Submitting: {isSubmitting ? "🔄 Yes" : "✅ No"}</div>
              <div>Button Enabled: {!(isSubmitting || !content.trim() || !selectedFile) ? "✅ Yes" : "❌ No"}</div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim() || !selectedFile}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            title={`Debug: isSubmitting=${isSubmitting}, hasContent=${!!content.trim()}, hasFile=${!!selectedFile}, content="${content.substring(0, 20)}...", fileName="${selectedFile?.name || 'none'}"`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Submit Assignment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Evaluation Setup Modal Component
const EvaluationSetupModal: React.FC<{
  assignment: Assignment;
  onSetup: (assignmentId: string) => void;
  onClose: () => void;
}> = ({ assignment, onSetup, onClose }) => {
  const [settings, setSettings] = useState({
    evaluationsPerSubmission: 2,
    maxEvaluationsPerUser: 3,
    evaluationDeadlineDays: 7,
    allowSelfEvaluation: false,
    randomizeAssignment: true,
    balanceWorkload: true,
  });

  const handleSetup = () => {
    onSetup(assignment._id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Setup Peer Evaluations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {assignment.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Graph Coloring Assignment
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Our advanced algorithm will automatically assign peer evaluations
              using graph coloring theory to ensure optimal distribution while
              avoiding conflicts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Evaluations per Submission
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={settings.evaluationsPerSubmission}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    evaluationsPerSubmission: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Evaluations per User
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxEvaluationsPerUser}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxEvaluationsPerUser: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Evaluation Deadline (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.evaluationDeadlineDays}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    evaluationDeadlineDays: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.randomizeAssignment}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    randomizeAssignment: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Randomize assignment within workload groups
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.balanceWorkload}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    balanceWorkload: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Balance workload across evaluators
              </span>
            </label>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Assignment Summary
            </h4>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <div>
                • {assignment.submissionStats.submittedCount} submissions ready
                for evaluation
              </div>
              <div>
                •{" "}
                {assignment.submissionStats.submittedCount *
                  settings.evaluationsPerSubmission}{" "}
                total evaluations will be created
              </div>
              <div>
                • Each student will evaluate {settings.evaluationsPerSubmission}{" "}
                peers (max {settings.maxEvaluationsPerUser})
              </div>
              <div>
                • Evaluations due in {settings.evaluationDeadlineDays} days
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSetup}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Setup Peer Evaluations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
