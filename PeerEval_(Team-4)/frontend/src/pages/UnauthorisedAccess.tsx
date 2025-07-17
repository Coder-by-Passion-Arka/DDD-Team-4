import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";

const UnauthorizedAccess: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const from = document.referrer || "/";

  useEffect(() => {
    console.log("🚫 Navigated to /not-authorised");
    console.log("Previous page:", from);

    addToast({
      type: "warning",
      title: "Access Denied",
      message: "You are not authorized to access this page.",
    });
  }, []);

  const handleGoBack = () => {
    console.log("🔙 Navigating back to:", from);
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-yellow-600">403 - Unauthorized</h1>
      <p className="text-gray-600">
        You do not have permission to view this page.
      </p>
      <button
        onClick={handleGoBack}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );
};

export default UnauthorizedAccess;
