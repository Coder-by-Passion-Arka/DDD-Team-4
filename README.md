# Dopamine Driving through Dashboard
"We’re excited to embark on this amazing project, where we aim to leverage dashboard-style interfaces to make learning more engaging, enjoyable, and enriching. By using intuitive, interactive dashboards, we can transform the learning experience, making it more immersive and motivating for learners."

## Overview
The version-0 was completed using simple Google Sheets and Google App Scripts.

**Dopamine Driving through Dashboard** is a unified visualisation platform developed at the **Dhananjaya Lab for Education Design (DLED)**. The primary goal of this project is to design and deliver intuitive dashboards for all ongoing and future projects within the lab, enabling data-driven insights and dopamine-rich user experiences.

## Tech Stack

This project is built using the **MERN stack**:
- **MongoDB** – NoSQL database for storing and retrieving project data.
- **Express.js** – Web framework for Node.js to manage backend APIs.
- **React.js** – Frontend library for building interactive dashboard components.
- **Node.js** – Runtime environment for executing JavaScript on the server.

## Folder Structure (DDD-Aligned)

 DDD-Team-4/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── achievement.models.js
│   │   │   ├── assignment.models.js
│   │   │   ├── dailyActivities.models.js
│   │   │   ├── evaluation.models.js
│   │   │   ├── preferences.models.js
│   │   │   ├── submission.models.js
│   │   │   └── user.models.js 
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── healthCheck.routes.js
│   │   ├── db/
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   ├── healthCheck.controller.js
│   │   │   └── user.controller.js
│   │   ├── utils/
│   │   │   ├── apiError.js
│   │   │   └── apiResponse.js
│   │   ├── services/
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── errorHandling.middlewares.js
│   │   │   └── multer.middlewares.js
│   │   ├── config/
│   │   │   ├── server.js
│   │   ├── app.js
│   │   ├── logger.js
│   │   ├── .env
│   │   ├── error.log
│   │   ├── package.json
│   │   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── FloatingChatbot.tsx
│   │   │   ├── LeaderboardModal.tsx
│   │   │   ├── LeaderboardPanel.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── RecentAssignments.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SkillSuggestionModal.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── StreakCounter.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   ├── pages/
│   │   │   ├── Achievements.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Assignments.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Evaluation.tsx
│   │   │   ├── GoToStudentProfile.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── SettingsPage.tsx
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useSkillSuggestion.ts
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── tailwind.config
├── .gitignore
├── README.md
└── other config files