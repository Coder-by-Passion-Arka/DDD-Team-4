import React, { useState } from "react";
import { ArrowLeft, User, Layers } from "lucide-react";
import SkillSuggestionModal from "../components/SkillSuggestionModal";
import { useSkillSuggestion } from "../hooks/useSkillSuggestion";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  date: string;
  assignedBy: string;
  description?: string;
  tags?: string[];
}

const AssignmentPage: React.FC = () => {
  // Mock user skills - in real app, this would come from user context/profile
  const [userSkills, setUserSkills] = useState<string[]>([
    "JavaScript",
    "React",
    "Node.js",
    "Python",
  ]);

  const [submittedAssignments, setSubmittedAssignments] = useState<
    Assignment[]
  >([
    {
      id: 1,
      title: "React Dashboard Development",
      subject: "Web Development",
      date: "2025-06-10",
      assignedBy: "Dr. Sarah Johnson",
      description:
        "Build a responsive dashboard using React, TypeScript, and Tailwind CSS",
      tags: ["react", "typescript", "tailwind", "dashboard"],
    },
    {
      id: 2,
      title: "Machine Learning Classification Project",
      subject: "Data Science",
      date: "2025-06-09",
      assignedBy: "Prof. Michael Chen",
      description:
        "Implement a classification algorithm using Python and scikit-learn",
      tags: ["python", "machine-learning", "scikit-learn", "classification"],
    },
  ]);

  const [checkedAssignments, setCheckedAssignments] = useState<Assignment[]>([
    {
      id: 3,
      title: "Docker Containerization Lab",
      subject: "DevOps",
      date: "2025-06-05",
      assignedBy: "Dr. Emily Rodriguez",
      description:
        "Containerize a Node.js application using Docker and Docker Compose",
      tags: ["docker", "nodejs", "containerization", "devops"],
    },
  ]);

  // Skill suggestion hook
  const skillSuggestion = useSkillSuggestion({
    userSkills,
    onSkillsAdded: (newSkills) => {
      setUserSkills((prev) => [...prev, ...newSkills]);
      console.log("Added skills to profile:", newSkills);
      // Here you would typically update the user's profile in your backend
    },
  });

  const handleMarkAsChecked = (assignment: Assignment) => {
    setSubmittedAssignments((prev) =>
      prev.filter((item) => item.id !== assignment.id)
    );
    setCheckedAssignments((prev) => [...prev, assignment]);

    // Trigger skill suggestion after marking as checked (simulating assignment completion)
    skillSuggestion.triggerSkillSuggestion({
      id: assignment.id.toString(),
      title: assignment.title,
      description: assignment.description,
      tags: assignment.tags,
    });
  };

  const handleMarkAsUnchecked = (assignment: Assignment) => {
    setCheckedAssignments((prev) =>
      prev.filter((item) => item.id !== assignment.id)
    );
    setSubmittedAssignments((prev) => [...prev, assignment]);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border-2 dark:border-gray-500/20 rounded-xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3 text-center ">
          <span>
            <Layers className="w-8 h-8 
            text-green-400 dark:text-green-500/80 inline-block" />{" "}
            Assignments Dashboard
          </span>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center">
          Manage your submitted and reviewed assignments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Submitted Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md dark:bg-gray-800 border-2 dark:border-gray-500/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">
            📩 Assignments Submitted by You
          </h2>
          {submittedAssignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No submitted assignments.
              </p>
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {submittedAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex flex-col p-3 sm:p-4 border rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:dark:bg-gray-700/90 transition duration-200 space-y-3"
                >
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white text-sm sm:text-base">
                      {assignment.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {assignment.subject} — {assignment.date}
                    </p>
                    {assignment.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {assignment.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-1 mt-1">
                      <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned by: {assignment.assignedBy}
                      </p>
                    </div>
                    {assignment.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
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
                  </div>
                  <button
                    onClick={() => handleMarkAsChecked(assignment)}
                    className="bg-blue-500 px-3 py-2 rounded hover:bg-blue-600 text-sm text-white transition-colors duration-200 w-full"
                  >
                    Mark as Checked
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Checked Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md dark:bg-gray-800 border-2 dark:border-gray-500/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">
            ✅ Assignments You Checked
          </h2>
          {checkedAssignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No checked assignments.
              </p>
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {checkedAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex flex-col p-3 sm:p-4 border rounded-lg bg-green-50 dark:bg-green-900/30 dark:border-green-500/50 space-y-3"
                >
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white text-sm sm:text-base">
                      {assignment.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {assignment.subject} — {assignment.date}
                    </p>
                    {assignment.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {assignment.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-1 mt-1">
                      <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned by: {assignment.assignedBy}
                      </p>
                    </div>
                    {assignment.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {assignment.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <span className="text-green-700 font-semibold text-sm dark:text-green-300 text-center sm:text-left flex-1">
                      ✅ Checked
                    </span>
                    <button
                      onClick={() => handleMarkAsUnchecked(assignment)}
                      className="flex items-center justify-center space-x-1 bg-gray-500 hover:bg-gray-600 px-3 py-2 rounded text-sm text-white transition-colors duration-200 w-full sm:w-auto"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Move Back</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Skill Suggestion Modal */}
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
    </div>
  );
};

export default AssignmentPage;
