import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  UserCircle2,
  CalendarDays,
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Book,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { useToast } from "../hooks/useToast";

// TypeScript interfaces for type safety
interface Course {
  _id: string;
  title: string;
  description: string;
  courseCode?: string;
  instructor: {
    _id: string;
    userName: string;
    userEmail: string;
  };
  assignments: number;
  completedBy: number;
  totalStudents: number;
  averageScore: number;
  status: "draft" | "starting_soon" | "active" | "completed" | "archived";
  schedule: {
    startDate: string;
    endDate: string;
    meetingDays?: string[];
    meetingTime?: { start: string; end: string };
  };
  enrolledStudents: Array<{
    student: string;
    enrolledAt: string;
    status: "active" | "dropped" | "completed";
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateCourseData {
  title: string;
  description: string;
  courseCode: string;
  instructor?: string; // Optional for admin use
  schedule: {
    startDate: string;
    endDate: string;
    meetingDays: string[];
    meetingTime: { start: string; end: string };
  };
  settings: {
    maxStudents: number;
    allowSelfEnrollment: boolean;
    isPublic: boolean;
  };
}

const CoursesPage: React.FC = () => {
  const { state } = useAuth();
  const toast = useToast();

  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateCourseData>({
    title: "",
    description: "",
    courseCode: "",
    schedule: {
      startDate: "",
      endDate: "",
      meetingDays: [],
      meetingTime: { start: "", end: "" },
    },
    settings: {
      maxStudents: 50,
      allowSelfEnrollment: false,
      isPublic: false,
    },
  });

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [state.user]);

  const fetchCourses = async () => {
    if (!state.user) return;

    try {
      setIsLoading(true);

      // TODO: Replace with actual API call when backend routes are ready
      // const response = await apiService.get('/courses');
      // setCourses(response.data);

      // Mock data for now
      const mockCourses: Course[] = [
        {
          _id: "1",
          title: "Data Structures",
          description: "Comprehensive study of data structures and algorithms",
          courseCode: "CS301",
          instructor: {
            _id: "inst1",
            userName: "Prof. Nisha Verma",
            userEmail: "nisha.verma@university.edu",
          },
          assignments: 6,
          completedBy: 20,
          totalStudents: 25,
          averageScore: 86,
          status: "active",
          schedule: {
            startDate: "2025-01-10",
            endDate: "2025-05-25",
            meetingDays: ["Monday", "Wednesday", "Friday"],
            meetingTime: { start: "09:00", end: "10:30" },
          },
          enrolledStudents: [],
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
        },
        {
          _id: "2",
          title: "Operating Systems",
          description: "Study of operating system concepts and design",
          courseCode: "CS401",
          instructor: {
            _id: "inst2",
            userName: "Dr. Rajat Kulkarni",
            userEmail: "rajat.kulkarni@university.edu",
          },
          assignments: 5,
          completedBy: 18,
          totalStudents: 30,
          averageScore: 78,
          status: "active",
          schedule: {
            startDate: "2025-02-01",
            endDate: "2025-06-01",
            meetingDays: ["Tuesday", "Thursday"],
            meetingTime: { start: "14:00", end: "15:30" },
          },
          enrolledStudents: [],
          createdAt: "2025-01-15T00:00:00Z",
          updatedAt: "2025-01-15T00:00:00Z",
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validation
      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error("Title and description are required");
        return;
      }

      if (!formData.schedule.startDate || !formData.schedule.endDate) {
        toast.error("Start date and end date are required");
        return;
      }

      // TODO: Replace with actual API call
      // const response = await apiService.post('/courses', formData);

      toast.success("Course created successfully!");
      setShowCreateForm(false);

      // Reset form
      setFormData({
        title: "",
        description: "",
        courseCode: "",
        schedule: {
          startDate: "",
          endDate: "",
          meetingDays: [],
          meetingTime: { start: "", end: "" },
        },
        settings: {
          maxStudents: 50,
          allowSelfEnrollment: false,
          isPublic: false,
        },
      });

      // Refresh courses list
      await fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateCourseData] as any),
          [child]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      case "starting_soon":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
      case "completed":
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/20";
      case "draft":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
      case "archived":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-64 shadow-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Explore Courses
        </h2>

        {/* Create Course Button for Teachers and Admins */}
        {(state?.user?.userRole === "teacher" ||
          state?.user?.userRole === "admin") && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Course</span>
          </button>
        )}
      </div>

      {/* Create Course Form Modal */}
      {showCreateForm &&
        (state?.user?.userRole === "teacher" ||
          state?.user?.userRole === "admin") && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-95 animate-scale-in">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create New Course
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="e.g., Data Structures and Algorithms"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="courseCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Course Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="courseCode"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="e.g., CS301"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                    placeholder="Brief description of the course, its objectives, and key topics..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="schedule.startDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="schedule.startDate"
                      name="schedule.startDate"
                      value={formData.schedule.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="schedule.endDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="schedule.endDate"
                      name="schedule.endDate"
                      value={formData.schedule.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="settings.maxStudents"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Maximum Students
                  </label>
                  <input
                    type="number"
                    id="settings.maxStudents"
                    name="settings.maxStudents"
                    value={formData.settings.maxStudents}
                    onChange={handleInputChange}
                    min="1"
                    max="500"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="settings.allowSelfEnrollment"
                      name="settings.allowSelfEnrollment"
                      checked={formData.settings.allowSelfEnrollment}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="settings.allowSelfEnrollment"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Allow Self-Enrollment
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="settings.isPublic"
                      name="settings.isPublic"
                      checked={formData.settings.isPublic}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="settings.isPublic"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      Public Course
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                  >
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Courses Grid */}
      {state?.user?.userRole === "student" ? (
        // Student View - Course Cards
        <div>
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl mx-auto max-w-2xl">
              <Book className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-500 mb-6 animate-bounce-subtle" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Courses Enrolled Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                It looks like you haven't joined any courses.
                <br />
                Reach out to your instructor to get started on your learning
                journey!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => {
                const percent =
                  course.totalStudents > 0
                    ? Math.round(
                        (course.completedBy / course.totalStudents) * 100
                      )
                    : 0;
                const statusClasses = getStatusColor(course.status);

                return (
                  <div
                    key={course._id}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-7 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                    onClick={() => {
                      /* Navigate to course details */
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {course.courseCode}
                        </p>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="space-y-3 mb-5 flex-grow">
                      <div className="flex items-center space-x-2 text-base text-gray-700 dark:text-gray-300">
                        <UserCircle2 className="w-5 h-5 text-blue-500" />
                        <span>{course.instructor.userName}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-base text-gray-700 dark:text-gray-300">
                        <CalendarDays className="w-5 h-5 text-purple-500" />
                        <span>
                          {formatDate(course.schedule.startDate)} –{" "}
                          {formatDate(course.schedule.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-base text-gray-700 dark:text-gray-300">
                        <ClipboardList className="w-5 h-5 text-green-500" />
                        <span>
                          <span className="font-semibold">
                            {course.assignments}
                          </span>{" "}
                          Assignments
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        <span>Course Progress</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-inner transition-all duration-700 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-indigo-700 dark:text-indigo-400 font-bold text-base flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Avg Score: {course.averageScore}%
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses}`}
                      >
                        {course.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // Teacher/Admin View - Course Management
        <div>
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl mx-auto max-w-3xl">
              <Book className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-500 mb-6 animate-bounce-subtle" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Courses Created Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                It's time to inspire! Create your first course and start shaping
                minds.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-base">
                        {course.description}
                      </p>
                    </div>
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                        course.status
                      )}`}
                    >
                      {course.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        {course.totalStudents}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Students
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">
                        {course.assignments}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Assignments
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                        {course.averageScore}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Avg Score
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                        {course.completedBy}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        {formatDate(course.schedule.startDate)} -{" "}
                        {formatDate(course.schedule.endDate)}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                        View Details
                      </button>
                      <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md">
                        Manage Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Unauthorized Access */}
      {!state?.user && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl mx-auto max-w-xl">
          <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <UserCircle2 className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Authentication Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Please log in to access and manage your courses.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;