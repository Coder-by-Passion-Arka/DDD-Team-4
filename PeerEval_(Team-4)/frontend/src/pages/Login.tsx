// // ✅ CRITICAL FIX: Hooks-Fixed Login.tsx - All early returns moved to TOP
// import React, { useState, useEffect } from "react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
// import { useGoogleLogin } from "@react-oauth/google";
// import { useAuth } from "../contexts/AuthContext";
// import { useToast } from "../hooks/useToast";
// import { AxiosError } from "axios";

// const Login: React.FC = () => {
//   // ✅ CRITICAL: Move ALL hooks to the top, before ANY conditional logic
//   const [formData, setFormData] = useState({
//     userEmail: "",
//     userPassword: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const { login, state, googleLogin } = useAuth();
//   const toast = useToast();
//   const navigate = useNavigate();

//   // ✅ CRITICAL: Enhanced auto-redirect with better logging
//   useEffect(() => {
//     console.log("🔍 Auth state changed:", {
//       isAuthenticated: state.isAuthenticated,
//       user: state.user?.userName,
//       isLoading: state.isLoading,
//       needsProfileCompletion: state.needsProfileCompletion,
//     });

//     if (state?.isAuthenticated && state.user && !state.isLoading) {
//       console.log("✅ Redirecting user...");

//       // Check if profile completion is needed
//       if (state.needsProfileCompletion) {
//         console.log(
//           "📋 Profile completion needed, redirecting to complete-profile"
//         );
//         navigate("/complete-profile", { replace: true });
//       } else {
//         console.log("🏠 Redirecting to dashboard");
//         navigate("/dashboard", { replace: true });
//       }
//     }
//   }, [
//     state.isAuthenticated,
//     state.user,
//     state.isLoading,
//     state.needsProfileCompletion,
//     navigate,
//   ]);

//   // ✅ Google Login Hook - MUST be called before any returns
//   const handleGoogleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       setIsLoading(true);
//       try {
//         console.log("🔍 Google OAuth success, token received");

//         // Get user info from Google
//         const userInfoResponse = await fetch(
//           `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
//         );

//         if (!userInfoResponse.ok) {
//           throw new Error("Failed to fetch user info from Google");
//         }

//         const userInfo = await userInfoResponse.json();
//         console.log("🔍 Google user info:", userInfo);

//         // Create credential in the format expected by backend
//         const credential = btoa(
//           JSON.stringify({
//             sub: userInfo.id,
//             email: userInfo.email,
//             name: userInfo.name,
//             picture: userInfo.picture,
//             email_verified: userInfo.verified_email,
//           })
//         );

//         console.log("🔍 Sending Google credential to backend...");
//         await googleLogin(credential);

//         console.log("✅ Google login completed successfully");
//       } catch (error: any) {
//         console.error("❌ Google login error:", error);
//         toast.error(error.message || "Google login failed. Please try again.", {
//           title: "Google Login Failed",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     onError: (error) => {
//       console.error("❌ Google OAuth error:", error);
//       toast.error("Google login failed. Please try again.", {
//         title: "Google Login Failed",
//       });
//       setIsLoading(false);
//     },
//   });

//   // ✅ CRITICAL: All conditional returns AFTER all hooks have been called
//   // Loading state check
//   if (state.isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Already authenticated check
//   if (state.isAuthenticated && !state.isLoading) {
//     console.log("🚫 Already authenticated, showing Navigate component");
//     return <Navigate to="/dashboard" replace />;
//   }

//   // ✅ Event handlers and helper functions
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const validateForm = (): string | null => {
//     if (!formData.userEmail.trim()) {
//       return "Email is required";
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.userEmail.trim())) {
//       return "Please enter a valid email address";
//     }

//     if (!formData.userPassword.trim()) {
//       return "Password is required";
//     }

//     if (formData.userPassword.length < 8) {
//       return "Password must be at least 8 characters long";
//     }

//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Client-side validation
//     const validationError = validateForm();
//     if (validationError) {
//       toast.error(validationError, {
//         title: "Validation Error",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       console.log("🔍 Submitting login form...");

//       await login(formData.userEmail.trim(), formData.userPassword);

//       // Success - store remember me preference
//       if (rememberMe) {
//         localStorage.setItem("rememberMe", "true");
//       }

//       console.log("✅ Login function completed successfully");
//     } catch (error) {
//       console.error("❌ Login form submission error:", error);

//       // Enhanced error handling
//       if (error instanceof AxiosError) {
//         const status = error.response?.status;
//         const errorData = error.response?.data;

//         switch (status) {
//           case 401:
//             toast.error(
//               "Invalid email or password. Please check your credentials and try again.",
//               {
//                 title: "Authentication Failed",
//               }
//             );
//             break;
//           case 403:
//             toast.error(
//               "Your account has been deactivated. Please contact support for assistance.",
//               {
//                 title: "Account Deactivated",
//               }
//             );
//             break;
//           case 404:
//             toast.error("No account found with this email.", {
//               title: "Account Not Found",
//               action: {
//                 label: "Register Instead",
//                 onClick: () => navigate("/register"),
//               },
//             });
//             break;
//           case 429:
//             toast.error(
//               "Too many login attempts. Please try again in a few minutes.",
//               {
//                 title: "Rate Limited",
//               }
//             );
//             break;
//           default:
//             toast.error(
//               errorData?.message || "Login failed. Please try again.",
//               {
//                 title: "Login Error",
//               }
//             );
//         }
//       } else {
//         toast.error(
//           error instanceof Error
//             ? error.message
//             : "Login failed. Please try again.",
//           {
//             title: "Login Error",
//           }
//         );
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSocialAuth = (provider: string) => {
//     if (provider.toLowerCase() === "google") {
//       console.log("🔍 Starting Google OAuth flow...");
//       handleGoogleLogin();
//     } else {
//       toast.info("GitHub authentication will be available soon!", {
//         title: "Coming Soon",
//         duration: 3000,
//       });
//     }
//   };

//   const handleForgotPassword = () => {
//     toast.info("Password reset feature will be available soon!", {
//       title: "Coming Soon",
//       duration: 3000,
//     });
//   };

//   // ✅ Main render - no early returns here
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Welcome Back
//           </h2>
//           <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//             Sign in to continue your journey
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <input
//               type="email"
//               name="userEmail"
//               placeholder="Email"
//               value={formData.userEmail}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//           </div>

//           <div>
//             <input
//               type="password"
//               name="userPassword"
//               placeholder="Password"
//               value={formData.userPassword}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//                 disabled={isLoading}
//                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//               />
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 Remember me
//               </span>
//             </label>

//             <button
//               type="button"
//               onClick={handleForgotPassword}
//               disabled={isLoading}
//               className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
//             >
//               Forgot password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center space-x-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span>Signing In...</span>
//               </>
//             ) : (
//               <span>Sign In</span>
//             )}
//           </button>
//         </form>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300 dark:border-gray-600" />
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
//               Or continue with
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-col gap-3">
//           <button
//             type="button"
//             disabled={isLoading}
//             onClick={() => handleSocialAuth("google")}
//             className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 py-3 rounded-lg shadow-sm hover:shadow-md transition disabled:opacity-50"
//           >
//             <FcGoogle size={20} />
//             <span className="text-gray-800 dark:text-gray-200">
//               Continue with Google
//             </span>
//           </button>
//           <button
//             type="button"
//             disabled={isLoading}
//             onClick={() => handleSocialAuth("github")}
//             className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-lg shadow-sm hover:bg-gray-800 transition disabled:opacity-50"
//           >
//             <FaGithub size={20} />
//             <span>Continue with GitHub</span>
//           </button>
//         </div>

//         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-indigo-600 hover:underline font-medium"
//           >
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

// ================================================== //

// Login.tsx

import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { AxiosError } from "axios";

const Login: React.FC = () => {
  // ALL hooks MUST be called first, before any conditional logic
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, state, googleLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Google Login Hook - MUST be called unconditionally
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        console.log("🔍 Google OAuth success, token received");

        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
        );

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info from Google");
        }

        const userInfo = await userInfoResponse.json();
        console.log("🔍 Google user info:", userInfo);

        // Create credential in the format expected by backend
        const credential = btoa(
          JSON.stringify({
            sub: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            email_verified: userInfo.verified_email,
          })
        );

        console.log("🔍 Sending Google credential to backend...");
        await googleLogin(credential);

        console.log("✅ Google login completed successfully");
      } catch (error: any) {
        console.error("❌ Google login error:", error);
        toast.error(error.message || "Google login failed. Please try again.", {
          title: "Google Login Failed",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("❌ Google OAuth error:", error);
      toast.error("Google login failed. Please try again.", {
        title: "Google Login Failed",
      });
      setIsLoading(false);
    },
  });

  // Enhanced auto-redirect with better logging
  useEffect(() => {
    console.log("🔍 Auth state changed:", {
      isAuthenticated: state.isAuthenticated,
      user: state.user?.userName,
      isLoading: state.isLoading,
      needsProfileCompletion: state.needsProfileCompletion,
    });

    if (state?.isAuthenticated && state.user && !state.isLoading) {
      console.log("✅ Redirecting user...");

      // Check if profile completion is needed
      if (state.needsProfileCompletion) {
        console.log(
          "📋 Profile completion needed, redirecting to complete-profile"
        );
        navigate("/complete-profile", { replace: true });
      } else {
        console.log("🏠 Redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [
    state.isAuthenticated,
    state.user,
    state.isLoading,
    state.needsProfileCompletion,
    navigate,
  ]);

  // ✅ Event handlers - defined after all hooks
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.userEmail.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail.trim())) {
      return "Please enter a valid email address";
    }

    if (!formData.userPassword.trim()) {
      return "Password is required";
    }

    if (formData.userPassword.length < 8) {
      return "Password must be at least 8 characters long";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, {
        title: "Validation Error",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔍 Submitting login form...");

      await login(formData.userEmail.trim(), formData.userPassword);

      // Success - store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      console.log("✅ Login function completed successfully");
    } catch (error) {
      console.error("❌ Login form submission error:", error);

      // Enhanced error handling
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            toast.error(
              "Invalid email or password. Please check your credentials and try again.",
              {
                title: "Authentication Failed",
              }
            );
            break;
          case 403:
            toast.error(
              "Your account has been deactivated. Please contact support for assistance.",
              {
                title: "Account Deactivated",
              }
            );
            break;
          case 404:
            toast.error("No account found with this email.", {
              title: "Account Not Found",
              action: {
                label: "Register Instead",
                onClick: () => navigate("/register"),
              },
            });
            break;
          case 429:
            toast.error(
              "Too many login attempts. Please try again in a few minutes.",
              {
                title: "Rate Limited",
              }
            );
            break;
          default:
            toast.error(
              errorData?.message || "Login failed. Please try again.",
              {
                title: "Login Error",
              }
            );
        }
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
          {
            title: "Login Error",
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    if (provider.toLowerCase() === "google") {
      console.log("🔍 Starting Google OAuth flow...");
      handleGoogleLogin();
    } else {
      toast.info("GitHub authentication will be available soon!", {
        title: "Coming Soon",
        duration: 3000,
      });
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset feature will be available soon!", {
      title: "Coming Soon",
      duration: 3000,
    });
  };

  // ✅ FIXED: Conditional rendering using JSX, not early returns
  // This ensures hooks are always called consistently

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (state.isAuthenticated && !state.isLoading) {
    console.log("🚫 Already authenticated, showing Navigate component");
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Main render - only after all conditional checks
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          </div>

          <div>
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
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialAuth("google")}
            className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 py-3 rounded-lg shadow-sm hover:shadow-md transition disabled:opacity-50"
          >
            <FcGoogle size={20} />
            <span className="text-gray-800 dark:text-gray-200">
              Continue with Google
            </span>
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialAuth("github")}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-lg shadow-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            <FaGithub size={20} />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
