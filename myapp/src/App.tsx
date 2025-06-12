// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import SideBar from "./components/SideBar";
import Breadcrumb from "./components/Breadcrumb";
import Dashboard from "./pages/Dashboard";
import Assignments from "./components/Assignments";
import Evaluations from "./pages/Evaluations";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex">
          <SideBar />
          <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 md:ml-64">
            <Breadcrumb />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
