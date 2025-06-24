import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GoToStudentProfileDialog() {
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim()) {
      // Navigate to the profile page with the entered ID
      navigate(`/profile/${studentId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter Student ID:
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="MongoDB ObjectId"
        />
      </label>
      <button type="submit">Go</button>
    </form>
  );
}

export default GoToStudentProfileDialog;
