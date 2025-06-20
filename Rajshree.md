## 🧠 OpenRouter API Integration Guide

This project integrates with [OpenRouter.ai](https://openrouter.ai), an API gateway that provides access to various language models (LLMs).

---

### 🔐 Step 1: Get Your API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign in using Google or email.
3. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
4. Click **"Create new API key"**.
5. Copy the generated key (it starts with `sk-or-...`).

---

### 📁 Step 2: Add API Key to Your `.env` File

Create a `.env` file at the frontend folder of the project , and paste:

OPENROUTER_API_KEY=sk-or-your-generated-key-here

---


### Daily Work Log

## 17-06-2025
Structured the MongoDB database model and defined key schemas with relationships to handle backend data efficiently.

## 16-06-2025
Built and styled responsive Login and Register pages in React with Tailwind CSS, and added social login UI elements.

## 14-06-2025
Set up MongoDB Atlas cluster, configured users and access, and inserted dummy student data for dashboard integration.

## 13-06-2025
Developed a floating chatbot component with open/close animations, connected it to OpenRouter API for real-time interaction.

## 12-06-2025
Completed styling and layout for Assignments, Achievements, and Evaluation pages; connected chatbot to display responses dynamically.

## 11-06-2025
Integrated AI chatbot into the dashboard using React and OpenRouter API, handled API communication and frontend rendering.
