import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:8024/api", // Fixed port
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
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const newToken = localStorage.getItem("accessToken");
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
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

  private async refreshToken(): Promise<void> {
    try {
      const response = await axios.post<
        ApiResponse<{
          accessToken: string;
          refreshToken?: string;
        }>
      >(
        "/user/refresh-token", // Removed /api prefix since baseURL includes it
        {},
        {
          withCredentials: true,
          baseURL: import.meta.env.VITE_API_URL || "http://localhost:8024/api",
        }
      );

      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  }

  // HTTP Methods
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(
      endpoint,
      config
    );
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(
      endpoint,
      config
    );
    return response.data;
  }

  // File upload method
  async uploadFile<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(
      endpoint,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}

export const apiService = new ApiService();
export { axios };
