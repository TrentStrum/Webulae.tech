import { withTimeout } from './helpers';
import axios from 'axios';

import type { AxiosRequestConfig } from 'axios';


declare global {
	interface Window {
		__clerk?: {
			session?: {
				getToken(): Promise<string | null>;
			};
		};
	}
}

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
	(response) => response,
	(error) => {
		console.error('API Client Error:', error.response?.data || error.message);
		return Promise.reject(error);
	}
);

// Wrap axios instance methods with timeout
const wrappedApiClient = {
	get: <T>(url: string, config?: AxiosRequestConfig) => withTimeout(apiClient.get<T>(url, config)),
	post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => withTimeout(apiClient.post<T>(url, data, config)),
	put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => withTimeout(apiClient.put<T>(url, data, config)),
	delete: <T>(url: string, config?: AxiosRequestConfig) => withTimeout(apiClient.delete<T>(url, config)),
	patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => withTimeout(apiClient.patch<T>(url, data, config)),
};

export { wrappedApiClient as apiClient };
