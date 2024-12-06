import axios from 'axios';

import { withTimeout } from './helpers';

import type { AxiosError, AxiosResponse } from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;

    // Retry logic for specific status codes
    if (
      config &&
      error.response &&
      [408, 429, 500, 502, 503, 504].includes(error.response.status) &&
      config.retryCount < 3
    ) {
      config.retryCount = (config.retryCount || 0) + 1;
      const delay = Math.min(1000 * (2 ** config.retryCount), 10000);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: async <T>(url: string, config?: object): Promise<T> => {
    try {
      const response = await withTimeout(axiosInstance.get<T>(url, config));
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  post: async <TPayload = unknown, TResponse = TPayload>(
    url: string,
    payload?: TPayload,
    config?: object,
  ): Promise<TResponse> => {
    try {
      const response = await withTimeout(
        axiosInstance.post<TPayload, AxiosResponse<TResponse>>(url, payload, config)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  put: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
    try {
      const response = await withTimeout(axiosInstance.put<T>(url, payload, config));
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  patch: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
    try {
      const response = await withTimeout(axiosInstance.patch<T>(url, payload, config));
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  delete: async <T>(url: string, config?: object): Promise<T> => {
    try {
      const response = await withTimeout(axiosInstance.delete<T>(url, config));
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    // Enhance error with additional context
    const enhancedError = new Error(message);
    (enhancedError as any).status = status;
    (enhancedError as any).code = error.code;
    
    throw enhancedError;
  }
  throw error;
}