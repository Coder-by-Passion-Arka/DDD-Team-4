// src/components/Login.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Welcome Back</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <div className="flex flex-col gap-3 pt-2">
          <button className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 py-2 rounded-lg shadow-sm hover:shadow-md transition">
            <FcGoogle size={20} />
            <span className="text-gray-800 dark:text-gray-200">Continue with Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-2 rounded-lg shadow-sm hover:bg-gray-800 transition">
            <FaGithub size={20} />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
