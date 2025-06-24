// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   ReactNode,
// } from "react";
// import { apiService } from "../services/api";
// import { AxiosError } from "axios";

// // Types matching your backend User model
// interface User {
//   _id: string;
//   userName: string;
//   userEmail: string;
//   userRole: "student" | "teacher" | "admin";
//   userProfileImage?: string;
//   userPhoneNumber?: string;
//   countryCode?: string;
//   userLocation?: {
//     homeAddress: string;
//     currentAddress: string;
//   };
//   userBio?: string;
//   userAcademicInformation?: {
//     universityName?: string;
//     degree?: string;
//     major?: string;
//     grade?: number;
//     graduationYear?: string;
//     startDate?: string;
//     endDate?: string;
//   };
//   userSkills?: string[];
//   userSocialMediaProfiles?: Array<{
//     platform: string;
//     profileLink: string;
//   }>;
//   userJoiningDate?: string;
//   userLastLogin?: string;
//   isActive?: boolean;
// }

// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
// }

// type AuthAction =
//   | { type: "AUTH_START" }
//   | {
//       type: "AUTH_SUCCESS";
//       payload: { user: User; accessToken: string; refreshToken: string };
//     }
//   | { type: "AUTH_FAILURE" }
//   | { type: "LOGOUT" }
//   | { type: "UPDATE_USER"; payload: User }
//   | {
//       type: "UPDATE_TOKENS";
//       payload: { accessToken: string; refreshToken?: string };
//     };

// // Registration data interface matching backend
// export interface RegisterData {
//   userName: string;
//   userEmail: string;
//   userPassword: string;
//   userPhoneNumber: string;
//   countryCode: string;
//   userLocation: {
//     homeAddress: string;
//     currentAddress: string;
//   };
//   avatar?: File;
//   coverImage?: File;
// }

// // Initial state
// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   refreshToken: null,
//   isLoading: true,
//   isAuthenticated: false,
// };

// // Reducer
// const authReducer = (state: AuthState, action: AuthAction): AuthState => {
//   switch (action.type) {
//     case "AUTH_START":
//       return { ...state, isLoading: true };

//     case "AUTH_SUCCESS":
//       return {
//         ...state,
//         user: action.payload.user,
//         accessToken: action.payload.accessToken,
//         refreshToken: action.payload.refreshToken,
//         isLoading: false,
//         isAuthenticated: true,
//       };

//     case "AUTH_FAILURE":
//       return {
//         ...state,
//         user: null,
//         accessToken: null,
//         refreshToken: null,
//         isLoading: false,
//         isAuthenticated: false,
//       };

//     case "LOGOUT":
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       return { ...initialState, isLoading: false };

//     case "UPDATE_USER":
//       return { ...state, user: action.payload };

//     case "UPDATE_TOKENS":
//       return {
//         ...state,
//         accessToken: action.payload.accessToken,
//         refreshToken: action.payload.refreshToken || state.refreshToken,
//       };

//     default:
//       return state;
//   }
// };

// // Context type
// interface AuthContextType {
//   state: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: RegisterData) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (userData: Partial<User>) => Promise<User>;
//   refreshAccessToken: () => Promise<void>;
//   getCurrentUser: () => Promise<User>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Provider component
// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Check for existing tokens on app start
//   useEffect(() => {
//     const checkAuth = async () => {
//       const accessToken = localStorage.getItem("accessToken");
//       const refreshToken = localStorage.getItem("refreshToken");

//       if (accessToken && refreshToken) {
//         try {
//           const response = await apiService.get<User>("/user/me");
//           dispatch({
//             type: "AUTH_SUCCESS",
//             payload: {
//               user: response.data,
//               accessToken,
//               refreshToken,
//             },
//           });
//         } catch (error) {
//           console.error("Auth check failed:", error);
//           dispatch({ type: "AUTH_FAILURE" });
//         }
//       } else {
//         dispatch({ type: "AUTH_FAILURE" });
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (
//     userEmail: string,
//     userPassword: string
//   ): Promise<void> => {
//     dispatch({ type: "AUTH_START" });

//     try {
//       const response = await apiService.post<{
//         user: User;
//         accessToken: string;
//         refreshToken: string;
//       }>("/user/login", { userEmail, userPassword });

//       const { user, accessToken, refreshToken } = response.data;

//       // Store tokens
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       dispatch({
//         type: "AUTH_SUCCESS",
//         payload: { user, accessToken, refreshToken },
//       });
//     } catch (error) {
//       dispatch({ type: "AUTH_FAILURE" });

//       if (error instanceof AxiosError) {
//         throw new Error(error.response?.data?.message || "Login failed");
//       }
//       throw new Error("Login failed");
//     }
//   };

//   const register = async (userData: RegisterData): Promise<void> => {
//     dispatch({ type: "AUTH_START" });

//     try {
//       const formData = new FormData();

//       // Add text fields
//       formData.append("userName", userData.userName);
//       formData.append("userEmail", userData.userEmail);
//       formData.append("userPassword", userData.userPassword);
//       formData.append("userPhoneNumber", userData.userPhoneNumber);
//       formData.append("countryCode", userData.countryCode);
//       formData.append("userLocation", JSON.stringify(userData.userLocation));

//       // Add files if present
//       if (userData.avatar) {
//         formData.append("avatar", userData.avatar);
//       }
//       if (userData.coverImage) {
//         formData.append("coverImage", userData.coverImage);
//       }

//       await apiService.uploadFile<User>("/user/register", formData);

//       // Registration successful, now login
//       await login(userData.userEmail, userData.userPassword);
//     } catch (error) {
//       dispatch({ type: "AUTH_FAILURE" });

//       if (error instanceof AxiosError) {
//         throw new Error(error.response?.data?.message || "Registration failed");
//       }
//       throw new Error("Registration failed");
//     }
//   };

//   const logout = async (): Promise<void> => {
//     try {
//       await apiService.post("/user/logout");
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       dispatch({ type: "LOGOUT" });
//     }
//   };

//   const updateProfile = async (userData: Partial<User>): Promise<User> => {
//     try {
//       const response = await apiService.patch<User>(
//         "/user/update-profile",
//         userData
//       );
//       dispatch({ type: "UPDATE_USER", payload: response.data });
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         throw new Error(
//           error.response?.data?.message || "Profile update failed"
//         );
//       }
//       throw new Error("Profile update failed");
//     }
//   };

//   const getCurrentUser = async (): Promise<User> => {
//     try {
//       const response = await apiService.get<User>("/user/me");
//       dispatch({ type: "UPDATE_USER", payload: response.data });
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         throw new Error(
//           error.response?.data?.message || "Failed to fetch user"
//         );
//       }
//       throw new Error("Failed to fetch user");
//     }
//   };

//   const refreshAccessToken = async (): Promise<void> => {
//     try {
//       const response = await apiService.post<{
//         accessToken: string;
//         refreshToken?: string;
//       }>("/user/refresh-token");

//       const { accessToken, refreshToken } = response.data;

//       localStorage.setItem("accessToken", accessToken);
//       if (refreshToken) {
//         localStorage.setItem("refreshToken", refreshToken);
//       }

//       dispatch({
//         type: "UPDATE_TOKENS",
//         payload: { accessToken, refreshToken },
//       });
//     } catch (error) {
//       dispatch({ type: "LOGOUT" });
//       throw error;
//     }
//   };

//   const value: AuthContextType = {
//     state,
//     login,
//     register,
//     logout,
//     updateProfile,
//     refreshAccessToken,
//     getCurrentUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // Export User type
// export type { User };

// =============================================== // 

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "../services/api";
import { AxiosError } from "axios";

// Types matching your backend User model
interface User {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: "student" | "teacher" | "admin";
  userProfileImage?: string;
  userCoverImage?: string;
  userPhoneNumber?: string;
  countryCode?: string;
  userLocation?: {
    homeAddress: string;
    currentAddress: string;
  };
  userBio?: string;
  userAcademicInformation?: {
    universityName?: string;
    degree?: string;
    major?: string;
    grade?: number;
    graduationYear?: string;
    startDate?: string;
    endDate?: string;
  };
  userSkills?: string[];
  userSocialMediaProfiles?: Array<{
    platform: string;
    profileLink: string;
  }>;
  userJoiningDate?: string;
  userLastLogin?: string;
  isActive?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "AUTH_START" }
  | {
      type: "AUTH_SUCCESS";
      payload: { user: User; accessToken: string; refreshToken: string };
    }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | {
      type: "UPDATE_TOKENS";
      payload: { accessToken: string; refreshToken?: string };
    };

// Registration data interface matching backend
export interface RegisterData {
  userName: string;
  userEmail: string;
  userPassword: string;
  userPhoneNumber: string;
  countryCode: string;
  userLocation: {
    homeAddress: string;
    currentAddress: string;
  };
  avatar?: File;
  coverImage?: File;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthenticated: true,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
      };

    case "LOGOUT":
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return { ...initialState, isLoading: false };

    case "UPDATE_USER":
      return { ...state, user: action.payload };

    case "UPDATE_TOKENS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken || state.refreshToken,
      };

    default:
      return state;
  }
};

// Context type
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  refreshAccessToken: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing tokens on app start
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const response = await apiService.get<User>("/user/me");
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              user: response.data,
              accessToken,
              refreshToken,
            },
          });
        } catch (error) {
          console.error("Auth check failed:", error);
          // Try to refresh token
          try {
            await refreshTokens();
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            dispatch({ type: "AUTH_FAILURE" });
          }
        }
      } else {
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    checkAuth();
  }, []);

  const refreshTokens = async () => {
    try {
      const response = await apiService.post<{
        accessToken: string;
        refreshToken?: string;
      }>("/user/refresh-token");

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      dispatch({
        type: "UPDATE_TOKENS",
        payload: { accessToken, refreshToken },
      });

      // Get updated user data
      const userResponse = await apiService.get<User>("/user/me");
      dispatch({ type: "UPDATE_USER", payload: userResponse.data });
    } catch (error) {
      dispatch({ type: "LOGOUT" });
      throw error;
    }
  };

  const login = async (
    userEmail: string,
    userPassword: string
  ): Promise<void> => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await apiService.post<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/user/login", { userEmail, userPassword });

      const { user, accessToken, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, accessToken, refreshToken },
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });

      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || "Login failed";
        throw new Error(errorMessage);
      }
      throw new Error("Login failed");
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: "AUTH_START" });

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("userName", userData.userName);
      formData.append("userEmail", userData.userEmail);
      formData.append("userPassword", userData.userPassword);
      formData.append("userPhoneNumber", userData.userPhoneNumber);
      formData.append("countryCode", userData.countryCode);
      formData.append("userLocation", JSON.stringify(userData.userLocation));

      // Add files if present
      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }
      if (userData.coverImage) {
        formData.append("coverImage", userData.coverImage);
      }

      const response = await apiService.uploadFile<User>(
        "/user/register",
        formData
      );

      // Registration successful, now login automatically
      await login(userData.userEmail, userData.userPassword);
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Registration failed";
        throw new Error(errorMessage);
      }
      throw new Error("Registration failed");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.post("/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await apiService.patch<User>(
        "/user/update-profile",
        userData
      );
      dispatch({ type: "UPDATE_USER", payload: response.data });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Profile update failed";
        throw new Error(errorMessage);
      }
      throw new Error("Profile update failed");
    }
  };

  const getCurrentUser = async (): Promise<User> => {
    try {
      const response = await apiService.get<User>("/user/me");
      dispatch({ type: "UPDATE_USER", payload: response.data });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch user";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch user");
    }
  };

  const refreshAccessToken = async (): Promise<void> => {
    await refreshTokens();
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateProfile,
    refreshAccessToken,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export User type
export type { User };
