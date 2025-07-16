// Fixed AuthContext.tsx - Key fixes marked with ✅
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { apiService } from "../services/api";
import { useToast } from "../hooks/useToast";

// Extend the Window interface to include google
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

// Helper function to get user info using the access token
const getUser = async (accessToken: string) => {
  const response = await apiService.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

// Types (same as before)
export interface User {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: "student" | "teacher" | "admin";
  userPhoneNumber?: string;
  countryCode?: string;
  userBio?: string;
  userProfileImage?: string;
  userCoverImage?: string;
  userLocation?: {
    homeAddress?: string;
    currentAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  userAcademicInformation?: {
    institution?: string;
    degree?: string;
    major?: string;
    graduationYear?: number;
    gpa?: number;
    academicLevel?: string;
  };
  userSkills?: Array<{
    name: string;
    level: string;
    category: string;
    verified: boolean;
  }>;
  userSocialMediaProfiles?: Array<{
    platform: string;
    username: string;
    url?: string;
    verified: boolean;
  }>;
  googleId?: string;
  authProvider?: string;
  emailVerified?: boolean;
  isActive: boolean;
  userLastLogin?: string;
  userJoiningDate?: string;
  preferences?: {
    theme?: "light" | "dark" | "system";
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  };
  statistics?: {
    totalAssignments?: number;
    completedAssignments?: number;
    totalEvaluations?: number;
    averageScore?: number;
    achievements?: number;
  };
}

export interface RegisterData {
  userName: string;
  userEmail: string;
  userPassword: string;
  userPhoneNumber: string;
  countryCode: string;
  userRole: "student" | "teacher" | "admin";
  userLocation: {
    homeAddress: string;
    currentAddress: string;
  };
  userBio?: string;
  userAcademicInformation?: any;
  userSkills?: any[];
  userSocialMediaProfiles?: any[];
  avatar?: File;
  coverImage?: File;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsProfileCompletion: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "LOGOUT" }
  | { type: "SET_NEEDS_PROFILE_COMPLETION"; payload: boolean }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | {
      type: "SET_AUTH_SUCCESS";
      payload: { user: User; needsProfileCompletion: boolean };
    }; // ✅ NEW

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
  completeSocialProfile: (data: any) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  googleLogout: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  needsProfileCompletion: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    // ✅ NEW: Combined action for successful auth
    case "SET_AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        needsProfileCompletion: action.payload.needsProfileCompletion,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };
    case "SET_NEEDS_PROFILE_COMPLETION":
      return {
        ...state,
        needsProfileCompletion: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const toast = useToast();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Auto-refresh token every 45 minutes
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(() => {
        refreshToken().catch(() => {
          console.log("Auto token refresh failed");
        });
      }, 45 * 60 * 1000); // 45 minutes

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      // Get current user info using the correct endpoint
      const response: any = await getUser(accessToken);

      if (response.user || response.data) {
        const user = response.user || response.data;
        dispatch({ type: "SET_USER", payload: user });

        // Check if profile completion is needed
        const needsCompletion =
          !user.userPhoneNumber ||
          !user.userLocation?.homeAddress ||
          !user.userLocation?.currentAddress;

        dispatch({
          type: "SET_NEEDS_PROFILE_COMPLETION",
          payload: needsCompletion,
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (error: any) {
      console.error("Auth status check failed:", error);

      // If token is invalid, try to refresh
      try {
        await refreshToken();
      } catch (refreshError) {
        // Refresh failed, clear auth state
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch({ type: "LOGOUT" });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // ✅ FIXED: Login function with proper response handling
  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      console.log("🔍 Attempting login for:", email);

      const response: any = await apiService.post("/auth/login", {
        userEmail: email,
        userPassword: password,
      });

      console.log("🔍 Login response:", response);

      if (response.user && response.accessToken) {
        // Store tokens
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        // ✅ FIXED: Use combined action for atomic state update
        dispatch({
          type: "SET_AUTH_SUCCESS",
          payload: {
            user: response.user,
            needsProfileCompletion: response.needsProfileCompletion || false,
          },
        });

        toast.success(`Welcome back, ${response.user.userName}!`);
        console.log("✅ Login successful, state updated");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // ✅ FIXED: Google login function
  const googleLogin = async (credential: string): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      console.log("🔍 Attempting Google login");

      const response: any = await apiService.post("/auth/google", {
        credential: credential,
      });

      console.log("🔍 Google login response:", response);

      if (response?.user && response?.accessToken) {
        // Store tokens
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        // ✅ FIXED: Use combined action for atomic state update
        dispatch({
          type: "SET_AUTH_SUCCESS",
          payload: {
            user: response.user,
            needsProfileCompletion: response.needsProfileCompletion || false,
          },
        });

        if (response.needsProfileCompletion) {
          toast.success("Welcome! Please complete your profile to continue.");
        } else {
          toast.success(`Welcome back, ${response.user.userName}!`);
        }
        console.log("✅ Google login successful, state updated");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const googleLogout = (): void => {
    try {
      // Clear Google session if available
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      // Call our regular logout to clear app state
      logout();
    } catch (error) {
      console.warn(
        "Google logout failed, but continuing with app logout:",
        error
      );
      // Still perform app logout even if Google logout fails
      logout();
    }
  };

  // ✅ FIXED: Register function
  const register = async (data: RegisterData): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      // Create FormData for file upload
      const formData = new FormData();

      // Append text fields
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof RegisterData];
        if (value !== undefined && key !== "avatar" && key !== "coverImage") {
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Append files
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }
      if (data.coverImage) {
        formData.append("coverImage", data.coverImage);
      }

      const response: any = await apiService.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.user && response.accessToken) {
        // Store tokens
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        // ✅ FIXED: Use combined action for atomic state update
        dispatch({
          type: "SET_AUTH_SUCCESS",
          payload: {
            user: response.user,
            needsProfileCompletion: response.needsProfileCompletion || false,
          },
        });

        toast.success(`Welcome to the platform, ${response.user.userName}!`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Call logout endpoint to invalidate server-side session
      try {
        await apiService.post("/auth/logout");
      } catch (error) {
        // Continue with logout even if server call fails
        console.warn("Server logout failed:", error);
      }

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Force logout even if there's an error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch({ type: "LOGOUT" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response: any = await apiService.post("/auth/refresh-token", {
        refreshToken,
      });

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error: any) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch({ type: "LOGOUT" });
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response: any = await apiService.patch(
        "/auth/update-profile",
        data
      );

      if (response.user || response.data) {
        const updatedUser = response.user || response.data;
        dispatch({ type: "UPDATE_USER", payload: updatedUser });
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Profile update failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const completeSocialProfile = async (data: any): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      console.log("🔍 Sending profile completion request with data:", data);

      // The apiService.patch already unwraps the response using unwrapResponse()
      const updatedUser: any = await apiService.patch(
        "/auth/complete-social-profile",
        data
      );

      console.log("🔍 Profile completion response (unwrapped):", updatedUser);

      if (updatedUser) {
        dispatch({ type: "UPDATE_USER", payload: updatedUser });
        dispatch({ type: "SET_NEEDS_PROFILE_COMPLETION", payload: false });
        console.log("✅ Profile completion state updated successfully");
        toast.success("Profile completed successfully");
      } else {
        console.error("❌ No user data received from server");
        throw new Error("No user data received from server");
      }
    } catch (error: any) {
      console.error("❌ Profile completion error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Profile completion failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    completeSocialProfile,
    checkAuthStatus,
    googleLogin,
    googleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ================================================================================= //

// import React, { createContext, useContext, useReducer, useEffect } from "react";
// import { apiService } from "../services/api";
// import { useToast } from "../hooks/useToast";

// // Extend the Window interface to include google
// declare global {
//   interface Window {
//     google?: {
//       accounts?: {
//         id?: {
//           disableAutoSelect: () => void;
//         };
//       };
//     };
//   }
// }

// // Helper function to get user info using the access token
// const getUser = async (accessToken: string) => {
//   const response = await apiService.get("/auth/me", {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   return response;
// };

// // Types
// export interface User {
//   _id: string;
//   userName: string;
//   userEmail: string;
//   userRole: "student" | "teacher" | "admin";
//   userPhoneNumber?: string;
//   countryCode?: string;
//   userBio?: string;
//   userProfileImage?: string;
//   userCoverImage?: string;
//   userLocation?: {
//     homeAddress?: string;
//     currentAddress?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     zipCode?: string;
//   };
//   userAcademicInformation?: {
//     institution?: string;
//     degree?: string;
//     major?: string;
//     graduationYear?: number;
//     gpa?: number;
//     academicLevel?: string;
//   };
//   userSkills?: Array<{
//     name: string;
//     level: string;
//     category: string;
//     verified: boolean;
//   }>;
//   userSocialMediaProfiles?: Array<{
//     platform: string;
//     username: string;
//     url?: string;
//     verified: boolean;
//   }>;
//   googleId?: string;
//   authProvider?: string;
//   emailVerified?: boolean;
//   isActive: boolean;
//   userLastLogin?: string;
//   userJoiningDate?: string;
//   preferences?: {
//     theme?: "light" | "dark" | "system";
//     language?: string;
//     timezone?: string;
//     notifications?: {
//       email?: boolean;
//       push?: boolean;
//       sms?: boolean;
//     };
//   };
//   statistics?: {
//     totalAssignments?: number;
//     completedAssignments?: number;
//     totalEvaluations?: number;
//     averageScore?: number;
//     achievements?: number;
//   };
// }

// export interface RegisterData {
//   userName: string;
//   userEmail: string;
//   userPassword: string;
//   userPhoneNumber: string;
//   countryCode: string;
//   userRole: "student" | "teacher" | "admin";
//   userLocation: {
//     homeAddress: string;
//     currentAddress: string;
//   };
//   userBio?: string;
//   userAcademicInformation?: any;
//   userSkills?: any[];
//   userSocialMediaProfiles?: any[];
//   avatar?: File;
//   coverImage?: File;
// }

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   needsProfileCompletion: boolean;
//   error: string | null;
// }

// type AuthAction =
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_USER"; payload: User }
//   | { type: "SET_ERROR"; payload: string }
//   | { type: "CLEAR_ERROR" }
//   | { type: "LOGOUT" }
//   | { type: "SET_NEEDS_PROFILE_COMPLETION"; payload: boolean }
//   | { type: "UPDATE_USER"; payload: Partial<User> };

// interface AuthContextType {
//   state: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   register: (data: RegisterData) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (data: Partial<User>) => Promise<void>;
//   refreshToken: () => Promise<void>;
//   completeSocialProfile: (data: any) => Promise<void>;
//   checkAuthStatus: () => Promise<void>;
//   googleLogin: (credential: string) => Promise<void>;
//   googleLogout: () => void;
// }

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
//   isLoading: true,
//   needsProfileCompletion: false,
//   error: null,
// };

// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload };
//     case "SET_USER":
//       return {
//         ...state,
//         user: action.payload,
//         isAuthenticated: true,
//         isLoading: false,
//         error: null,
//       };
//     case "SET_ERROR":
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false,
//       };
//     case "CLEAR_ERROR":
//       return { ...state, error: null };
//     case "LOGOUT":
//       return {
//         ...initialState,
//         isLoading: false,
//       };
//     case "SET_NEEDS_PROFILE_COMPLETION":
//       return {
//         ...state,
//         needsProfileCompletion: action.payload,
//       };
//     case "UPDATE_USER":
//       return {
//         ...state,
//         user: state.user ? { ...state.user, ...action.payload } : null,
//       };
//     default:
//       return state;
//   }
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//   const toast = useToast();

//   // Check authentication status on app load
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Auto-refresh token every 45 minutes
//   useEffect(() => {
//     if (state.isAuthenticated) {
//       const interval = setInterval(() => {
//         refreshToken().catch(() => {
//           console.log("Auto token refresh failed");
//         });
//       }, 45 * 60 * 1000); // 45 minutes

//       return () => clearInterval(interval);
//     }
//   }, [state.isAuthenticated]);

//   const checkAuthStatus = async (): Promise<void> => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });

//       const accessToken = localStorage.getItem("accessToken");
//       if (!accessToken) {
//         dispatch({ type: "LOGOUT" });
//         return;
//       }

//       // Get current user info using the correct endpoint
//       const response: any = await getUser(accessToken);

//       if (response.user || response.data) {
//         const user = response.user || response.data;
//         dispatch({ type: "SET_USER", payload: user });

//         // Check if profile completion is needed
//         const needsCompletion =
//           !user.userPhoneNumber ||
//           !user.userLocation?.homeAddress ||
//           !user.userLocation?.currentAddress;

//         dispatch({
//           type: "SET_NEEDS_PROFILE_COMPLETION",
//           payload: needsCompletion,
//         });
//       } else {
//         dispatch({ type: "LOGOUT" });
//       }
//     } catch (error: any) {
//       console.error("Auth status check failed:", error);

//       // If token is invalid, try to refresh
//       try {
//         await refreshToken();
//       } catch (refreshError) {
//         // Refresh failed, clear auth state
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         dispatch({ type: "LOGOUT" });
//       }
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   const login = async (email: string, password: string): Promise<void> => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "CLEAR_ERROR" });

//       // ✅ FIXED: Use correct endpoint
//       const response: any = await apiService.post("/auth/login", {
//         userEmail: email,
//         userPassword: password,
//       });

//       if (response.user && response.accessToken) {
//         // Store tokens
//         localStorage.setItem("accessToken", response.accessToken);
//         if (response.refreshToken) {
//           localStorage.setItem("refreshToken", response.refreshToken);
//         }

//         dispatch({ type: "SET_USER", payload: response.user });

//         // Check if profile completion is needed
//         const needsCompletion =
//           !response.user.userPhoneNumber ||
//           !response.user.userLocation?.homeAddress ||
//           !response.user.userLocation?.currentAddress;

//         dispatch({
//           type: "SET_NEEDS_PROFILE_COMPLETION",
//           payload: needsCompletion,
//         });

//         toast.success(`Welcome back, ${response.user.userName}!`);
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || error.message || "Login failed";
//       dispatch({ type: "SET_ERROR", payload: errorMessage });
//       throw new Error(errorMessage);
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   const googleLogin = async (credential: string): Promise<void> => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "CLEAR_ERROR" });

//       // ✅ FIXED: Use correct endpoint and send the Google credential properly
//       const response: any = await apiService.post("/auth/google", {
//         credential: credential,
//       });

//       if (response.user && response.accessToken) {
//         // Store tokens
//         localStorage.setItem("accessToken", response.accessToken);
//         if (response.refreshToken) {
//           localStorage.setItem("refreshToken", response.refreshToken);
//         }

//         dispatch({ type: "SET_USER", payload: response.user });

//         // Check if profile completion is needed for Google users
//         const needsCompletion =
//           response.needsProfileCompletion ||
//           !response.user.userPhoneNumber ||
//           !response.user.userLocation?.homeAddress ||
//           !response.user.userLocation?.currentAddress;

//         dispatch({
//           type: "SET_NEEDS_PROFILE_COMPLETION",
//           payload: needsCompletion,
//         });

//         if (needsCompletion) {
//           toast.success("Welcome! Please complete your profile to continue.");
//         } else {
//           toast.success(`Welcome back, ${response.user.userName}!`);
//         }
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || error.message || "Google login failed";
//       dispatch({ type: "SET_ERROR", payload: errorMessage });
//       throw new Error(errorMessage);
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   const googleLogout = (): void => {
//     try {
//       // Clear Google session if available
//       if (window.google?.accounts?.id) {
//         window.google.accounts.id.disableAutoSelect();
//       }

//       // Call our regular logout to clear app state
//       logout();
//     } catch (error) {
//       console.warn(
//         "Google logout failed, but continuing with app logout:",
//         error
//       );
//       // Still perform app logout even if Google logout fails
//       logout();
//     }
//   };

//   const register = async (data: RegisterData): Promise<void> => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "CLEAR_ERROR" });

//       // Create FormData for file upload
//       const formData = new FormData();

//       // Append text fields
//       Object.keys(data).forEach((key) => {
//         const value = data[key as keyof RegisterData];
//         if (value !== undefined && key !== "avatar" && key !== "coverImage") {
//           if (typeof value === "object") {
//             formData.append(key, JSON.stringify(value));
//           } else {
//             formData.append(key, value.toString());
//           }
//         }
//       });

//       // Append files
//       if (data.avatar) {
//         formData.append("avatar", data.avatar);
//       }
//       if (data.coverImage) {
//         formData.append("coverImage", data.coverImage);
//       }

//       // ✅ FIXED: Use correct endpoint
//       const response: any = await apiService.post("/auth/register", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.user && response.accessToken) {
//         // Store tokens
//         localStorage.setItem("accessToken", response.accessToken);
//         if (response.refreshToken) {
//           localStorage.setItem("refreshToken", response.refreshToken);
//         }

//         dispatch({ type: "SET_USER", payload: response.user });
//         dispatch({ type: "SET_NEEDS_PROFILE_COMPLETION", payload: false });

//         toast.success(`Welcome to the platform, ${response.user.userName}!`);
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || error.message || "Registration failed";
//       dispatch({ type: "SET_ERROR", payload: errorMessage });
//       throw new Error(errorMessage);
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   const logout = async (): Promise<void> => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });

//       // Call logout endpoint to invalidate server-side session
//       try {
//         await apiService.post("/auth/logout");
//       } catch (error) {
//         // Continue with logout even if server call fails
//         console.warn("Server logout failed:", error);
//       }

//       // Clear local storage
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");

//       dispatch({ type: "LOGOUT" });
//       toast.success("Logged out successfully");
//     } catch (error: any) {
//       console.error("Logout error:", error);
//       // Force logout even if there's an error
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       dispatch({ type: "LOGOUT" });
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   const refreshToken = async (): Promise<void> => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       if (!refreshToken) {
//         throw new Error("No refresh token available");
//       }

//       const response: any = await apiService.post("/auth/refresh-token", {
//         refreshToken,
//       });

//       if (response.accessToken) {
//         localStorage.setItem("accessToken", response.accessToken);
//         if (response.refreshToken) {
//           localStorage.setItem("refreshToken", response.refreshToken);
//         }
//       } else {
//         throw new Error("Invalid refresh response");
//       }
//     } catch (error: any) {
//       console.error("Token refresh failed:", error);
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       dispatch({ type: "LOGOUT" });
//       throw error;
//     }
//   };

//   const updateProfile = async (data: Partial<User>): Promise<void> => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "CLEAR_ERROR" });

//       const response: any = await apiService.patch(
//         "/auth/update-profile",
//         data
//       );

//       if (response.user || response.data) {
//         const updatedUser = response.user || response.data;
//         dispatch({ type: "UPDATE_USER", payload: updatedUser });
//         toast.success("Profile updated successfully");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Profile update failed";
//       dispatch({ type: "SET_ERROR", payload: errorMessage });
//       throw new Error(errorMessage);
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   const completeSocialProfile = async (data: any): Promise<void> => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });
//       dispatch({ type: "CLEAR_ERROR" });

//       const response: any = await apiService.patch(
//         "/auth/complete-social-profile",
//         data
//       );

//       if (response.user || response.data) {
//         const updatedUser = response.user || response.data;
//         dispatch({ type: "UPDATE_USER", payload: updatedUser });
//         dispatch({ type: "SET_NEEDS_PROFILE_COMPLETION", payload: false });
//         toast.success("Profile completed successfully");
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Profile completion failed";
//       dispatch({ type: "SET_ERROR", payload: errorMessage });
//       throw new Error(errorMessage);
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   const value: AuthContextType = {
//     state,
//     login,
//     register,
//     logout,
//     updateProfile,
//     refreshToken,
//     completeSocialProfile,
//     checkAuthStatus,
//     googleLogin,
//     googleLogout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };