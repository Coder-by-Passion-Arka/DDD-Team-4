// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// interface ApiResponse<T = any> {
//   success: boolean;
//   message: string;
//   data: T;
//   statusCode: number;
// }

// class ApiService {
//   private axiosInstance: AxiosInstance;

//   constructor() {
//     this.axiosInstance = axios.create({
//       baseURL: import.meta.env.VITE_API_URL || "http://localhost:8024/api/v1", // Fixed port and path
//       timeout: 10000,
//       withCredentials: true, // Include cookies
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors(): void {
//     // Request interceptor to add auth token
//     this.axiosInstance.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem("accessToken");
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor to handle token refresh
//     this.axiosInstance.interceptors.response.use(
//       (response: AxiosResponse<ApiResponse>) => response,
//       async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;

//           try {
//             await this.refreshToken();
//             const newToken = localStorage.getItem("accessToken");
//             if (newToken) {
//               originalRequest.headers.Authorization = `Bearer ${newToken}`;
//               return this.axiosInstance(originalRequest);
//             }
//           } catch (refreshError) {
//             // Refresh failed, redirect to login
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("refreshToken");
//             window.location.href = "/login";
//             return Promise.reject(refreshError);
//           }
//         }

//         return Promise.reject(error);
//       }
//     );
//   }

//   private async refreshToken(): Promise<void> {
//     try {
//       const response = await axios.post<
//         ApiResponse<{
//           accessToken: string;
//           refreshToken?: string;
//         }>
//       >(
//         "/user/refresh-token", // Removed /api prefix since baseURL includes it
//         {},
//         {
//           withCredentials: true,
//           baseURL: import.meta.env.VITE_API_URL || "http://localhost:8024/api",
//         }
//       );

//       const { accessToken, refreshToken } = response.data.data;
//       localStorage.setItem("accessToken", accessToken);
//       if (refreshToken) {
//         localStorage.setItem("refreshToken", refreshToken);
//       }
//     } catch (error) {
//       throw new Error("Token refresh failed");
//     }
//   }

//   // HTTP Methods
//   async get<T>(
//     endpoint: string,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await this.axiosInstance.get<ApiResponse<T>>(
//       endpoint,
//       config
//     );
//     return response.data;
//   }

//   async post<T>(
//     endpoint: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await this.axiosInstance.post<ApiResponse<T>>(
//       endpoint,
//       data,
//       config
//     );
//     return response.data;
//   }

//   async patch<T>(
//     endpoint: string,
//     data: any,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await this.axiosInstance.patch<ApiResponse<T>>(
//       endpoint,
//       data,
//       config
//     );
//     return response.data;
//   }

//   async delete<T>(
//     endpoint: string,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await this.axiosInstance.delete<ApiResponse<T>>(
//       endpoint,
//       config
//     );
//     return response.data;
//   }

//   // File upload method
//   async uploadFile<T>(
//     endpoint: string,
//     formData: FormData
//   ): Promise<ApiResponse<T>> {
//     const response = await this.axiosInstance.post<ApiResponse<T>>(
//       endpoint,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data;
//   }
// }

// export const apiService = new ApiService();
// export { axios };

// ======================================================================== //

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

class ApiService {
  private axiosInstance: AxiosInstance;

  // Create axios instance
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:8024/api",
      timeout: 10000,
      withCredentials: true, // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Enhanced logging for debugging
        console.log("🔍 API Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
          data: config.data ? "Data present" : "No data",
        });

        return config;
      },
      (error) => {
        console.error("❌ Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // Enhanced logging for debugging
        console.log("✅ API Response:", {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          data: response.data,
        });

        return response;
      },
      async (error) => {
        console.error("❌ API Response error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log("🔄 Attempting token refresh...");
            await this.refreshToken();
            const newToken = localStorage.getItem("accessToken");
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              console.log("✅ Token refreshed, retrying request");
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);
            // Refresh failed, redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Fixed refresh token variable name and payload
  private async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      console.log("🔄 Attempting token refresh...");

      // ✅ FIX: Updated refresh token endpoint to match route structure
      const response = await axios.post<
        ApiResponse<{
          accessToken: string;
          refreshToken?: string;
        }>
      >(
        "/v1/auth/refresh-token",
        { refreshToken },
        {
          withCredentials: true,
          baseURL: import.meta.env.VITE_API_URL || "http://localhost:8024/api",
        }
      );

      console.log("🔄 Token refresh response:", response.data);

      // Handle both wrapped and unwrapped responses
      const responseData = response.data;
      let tokenData;

      if (responseData?.data) {
        // Wrapped response
        tokenData = responseData.data;
      }
      // else if (responseData.accessToken) {
      //   // Direct response
      //   tokenData = responseData;
      // }
      else {
        throw new Error("Invalid refresh response format");
      }

      if (
        tokenData &&
        typeof tokenData === "object" &&
        "accessToken" in tokenData
      ) {
        localStorage.setItem("accessToken", tokenData.accessToken);
        if ("refreshToken" in tokenData && tokenData.refreshToken) {
          localStorage.setItem("refreshToken", tokenData.refreshToken);
        }
      } else {
        throw new Error("Invalid token data format");
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      throw new Error("Token refresh failed");
    }
  }

  // Utility to unwrap the nested `data` field returned by backend ApiResponse
  private unwrapResponse<T>(apiResponse: ApiResponse<T>): T {
    // Our backend wraps actual payload inside `data`
    // e.g. { success:true, message:"...", data:{...}, statusCode:200 }
    // We always want the inner payload in the front-end services.
    if (
      apiResponse &&
      typeof apiResponse === "object" &&
      "data" in apiResponse
    ) {
      return apiResponse.data as T;
    }
    // Fallback – return full object if shape is unexpected
    return apiResponse as unknown as T;
  }

  // HTTP Methods with better error handling
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(
        normalizedEndpoint,
        config
      );
      return this.unwrapResponse<T>(response.data);
    } catch (error) {
      console.error("❌ GET request failed:", normalizedEndpoint, error);
      throw error;
    }
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(
        normalizedEndpoint,
        data,
        config
      );
      return this.unwrapResponse<T>(response.data);
    } catch (error) {
      console.error("❌ POST request failed:", normalizedEndpoint, error);
      throw error;
    }
  }

  async patch<T>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T>>(
        normalizedEndpoint,
        data,
        config
      );
      return this.unwrapResponse<T>(response.data);
    } catch (error) {
      console.error("❌ PATCH request failed:", normalizedEndpoint, error);
      throw error;
    }
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(
        normalizedEndpoint,
        config
      );
      return this.unwrapResponse<T>(response.data);
    } catch (error) {
      console.error("❌ DELETE request failed:", normalizedEndpoint, error);
      throw error;
    }
  }

  // File upload method with better error handling
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);

    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(
        normalizedEndpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return this.unwrapResponse<T>(response.data);
    } catch (error) {
      console.error("❌ File upload failed:", normalizedEndpoint, error);
      throw error;
    }
  }

  // Helper method to normalize endpoints
  private normalizeEndpoint(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    // Add /v1 prefix if not already present
    if (!cleanEndpoint.startsWith("v1/")) {
      return `/v1/${cleanEndpoint}`;
    }

    return `/${cleanEndpoint}`;
  }

  // Get current API base URL
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || "";
  }

  // Update base URL if needed
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  // Clear all tokens
  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const apiService = new ApiService();
export { axios };

// Google OAuth route with better error handling
export const googleAuth = (credential: string) => {
  console.log(`\nInside the googleAuth function in api.ts`);
  console.log("Credentials received are: ", credential);
  return apiService.post("/auth/google", { credential });
};

// Auth-related utility functions
export const authUtils = {
  isLoggedIn: () => apiService.isAuthenticated(),
  logout: () => {
    apiService.clearTokens();
    window.location.href = "/login";
  },
  getToken: () => localStorage.getItem("accessToken"),
  setToken: (token: string) => localStorage.setItem("accessToken", token),
};

// ======================================================================== //