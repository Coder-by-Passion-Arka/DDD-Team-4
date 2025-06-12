import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Breadcrumb from './components/Breadcrumb';
import DashboardHome from './pages/Dashboard';
import AssignmentsPage from './pages/Assignments';
import EvaluationsPage from './pages/Evaluations';
import AnalyticsPage from './pages/Analytics';
import AchievementsPage from './pages/Achievements';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Breadcrumb />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="evaluations" element={<EvaluationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;