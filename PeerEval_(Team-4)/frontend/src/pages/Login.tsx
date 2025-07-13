// codebase
import React, { useState , useEffect} from "react";
import { Link, Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";
import { signInWithGoogle } from "../services/firebase";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, state, setUser } = useAuth();

  // ✅ Restore user from localStorage token on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (state.user && state.user._id) {
        setUser({ ...state.user, accessToken: token }); // optionally fetch full profile here
      }
    }
  }, []);

  // Redirect if already authenticated
  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.userEmail, formData.userPassword);
      // Navigation will happen automatically via auth state change
    } catch (error) {
      console.error("Login error (handleSubmit):", error); // More detailed logging
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Login failed");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Sign in with Firebase
      const firebaseUser = await signInWithGoogle();
      if (!firebaseUser) throw new Error("Google sign-in failed");

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Send token to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8024/api"}/auth/firebase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
          credentials: "include",
        }
      );
      const result = await response.json();

      // ✅ Store access token
      localStorage.setItem("accessToken", result.accessToken);

      // ✅ Set user in context (if using AuthContext)
      setUser(result.user);

      if (!response.ok) throw new Error(result.message || "Google login failed");

      // Optionally: update auth context if needed
      window.location.href = "/dashboard";
    } catch (error: any) {
      setError(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="userEmail"
            placeholder="Email"
            value={formData.userEmail}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />
          <input
            type="password"
            name="userPassword"
            placeholder="Password"
            value={formData.userPassword}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 py-2 rounded-lg shadow-sm hover:shadow-md transition disabled:opacity-50"
          >
            <FcGoogle size={20} />
            <span className="text-gray-800 dark:text-gray-200">
              Continue with Google
            </span>
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-2 rounded-lg shadow-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            <FaGithub size={20} />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
