import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
apiClient.interceptors.request.use(async (config) => {
  // Get auth token from Clerk
  const token = await window.__clerk?.session?.getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await window.__clerk?.session?.refresh();
        
        // Retry request with new token
        const token = await window.__clerk?.session?.getToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure
        window.__clerk?.signOut();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };