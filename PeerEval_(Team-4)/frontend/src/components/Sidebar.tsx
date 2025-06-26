import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Target,
  BarChart3,
  Trophy,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Users,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileMenuOpen?: boolean;
  onMobileToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  mobileMenuOpen = false,
  onMobileToggle,
}) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  // Regular menu items
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: FileText,
      path: "/assignments",
    },
    {
      id: "evaluations",
      label: "Evaluations",
      icon: Target,
      path: "/evaluations",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      path: "/achievements",
    },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  // Admin-only menu items
  const adminItems = [
    {
      id: "admin-users",
      label: "User Management",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "admin-system",
      label: "System Settings",
      icon: Shield,
      path: "/admin/system",
    },
  ];

  const handleNavClick = () => {
    if (onMobileToggle) {
      onMobileToggle();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "teacher":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 hidden lg:block ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    PeerEval
                  </span>
                </div>
              )}
              <button
                onClick={onToggle}
                className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${
                  isCollapsed ? "mx-auto" : ""
                }`}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {/* Regular Menu Items */}
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `w-full flex items-center ${
                          isCollapsed
                            ? "justify-center px-3 py-3"
                            : "space-x-3 px-3 py-2.5"
                        } rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        }`
                      }
                      title={isCollapsed ? item.label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-5 h-5 flex-shrink-0 ${
                              isActive
                                ? "text-white"
                                : "group-hover:scale-110 transition-transform duration-200"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}

              {/* Admin-only Menu Items */}
              {state.user?.userRole === "admin" && (
                <>
                  {/* Divider */}
                  <li className="py-2">
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    {!isCollapsed && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-3 font-medium uppercase tracking-wider">
                        Admin
                      </p>
                    )}
                  </li>

                  {adminItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.id}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `w-full flex items-center ${
                              isCollapsed
                                ? "justify-center px-3 py-3"
                                : "space-x-3 px-3 py-2.5"
                            } rounded-xl transition-all duration-200 group ${
                              isActive
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                                : "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                            }`
                          }
                          title={isCollapsed ? item.label : undefined}
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isActive
                                    ? "text-white"
                                    : "group-hover:scale-110 transition-transform duration-200"
                                }`}
                              />
                              {!isCollapsed && (
                                <span className="font-medium">
                                  {item.label}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </nav>

          {/* Enhanced Footer with Logout */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {state.user?.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {state.user?.userName || "User"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(
                          state.user?.userRole || "student"
                        )}`}
                      >
                        {state.user?.userRole || "student"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Collapsed State Logout */}
          {isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-30 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                PeerEval
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {/* Regular Menu Items */}
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-5 h-5 flex-shrink-0 ${
                              isActive
                                ? "text-white"
                                : "group-hover:scale-110 transition-transform duration-200"
                            }`}
                          />
                          <span className="font-medium">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}

              {/* Admin-only Menu Items (Mobile) */}
              {state.user?.userRole === "admin" && (
                <>
                  {/* Divider */}
                  <li className="py-2">
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-3 font-medium uppercase tracking-wider">
                      Admin
                    </p>
                  </li>

                  {adminItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.id}>
                        <NavLink
                          to={item.path}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                              isActive
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                                : "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isActive
                                    ? "text-white"
                                    : "group-hover:scale-110 transition-transform duration-200"
                                }`}
                              />
                              <span className="font-medium">{item.label}</span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </nav>

          {/* Enhanced Mobile Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {state.user?.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {state.user?.userName || "User"}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(
                      state.user?.userRole || "student"
                    )}`}
                  >
                    {state.user?.userRole || "student"}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
