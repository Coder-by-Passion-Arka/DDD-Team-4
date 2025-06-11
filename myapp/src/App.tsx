//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot"; // import your Chatbot component

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

