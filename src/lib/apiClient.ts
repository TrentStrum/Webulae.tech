import axios from 'axios';
import { withTimeout } from './helpers';

const apiClient = axios.create({
	baseURL: '/',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add request interceptor
apiClient.interceptors.request.use(
	async (config) => {
		try {
			const token = await window.__clerk?.session?.getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		} catch (error) {
			console.error('Error getting auth token:', error);
			return config;
		}
	},
	(error) => {
		console.error('Request interceptor error:', error);
		return Promise.reject(error);
	}
);

// Add response interceptor
apiClient.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		if (axios.isAxiosError(error)) {
			const message = error.response?.data?.error || error.message;
			console.error(`API Error (${error.config?.url}):`, message);
			
			// Enhance error with more details
			const enhancedError = new Error(message);
			enhancedError.name = 'APIError';
			enhancedError.cause = {
				status: error.response?.status,
				data: error.response?.data,
				url: error.config?.url,
			};
			
			return Promise.reject(enhancedError);
		}
		return Promise.reject(error);
	}
);

// Wrap axios instance methods with timeout
const wrappedApiClient = {
	get: <T>(url: string, config?: any) => withTimeout(apiClient.get<T>(url, config)),
	post: <T>(url: string, data?: any, config?: any) => withTimeout(apiClient.post<T>(url, data, config)),
	put: <T>(url: string, data?: any, config?: any) => withTimeout(apiClient.put<T>(url, data, config)),
	delete: <T>(url: string, config?: any) => withTimeout(apiClient.delete<T>(url, config)),
	patch: <T>(url: string, data?: any, config?: any) => withTimeout(apiClient.patch<T>(url, data, config)),
};

export { wrappedApiClient as apiClient };
