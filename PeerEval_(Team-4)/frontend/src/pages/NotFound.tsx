import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const from = document.referrer || "/";

  useEffect(() => {
    console.log("❌ Navigated to /no-page-found");
    console.log("Previous page:", from);

    addToast({
      type: "error",
      title: "Page Not Found",
      message: "The page you’re looking for does not exist.",
    });
  }, []);

  const handleGoBack = () => {
    console.log("🔙 Navigating back to:", from);
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-red-600">404 - Not Found</h1>
      <p className="text-gray-600 dark:text-white">
        This page doesn't exist or has been moved.
      </p>
      <p className="text-gray-600 dark:text-white">
        Please check the URL or contact the Technical Team.
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

export default NotFound;
