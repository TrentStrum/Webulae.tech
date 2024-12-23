import axios from 'axios';

import { toast } from '@/src/hooks/helpers/use-toast';

import type { AxiosRequestConfig } from 'axios';



declare global {
	interface Window {
		__clerk?: {
			session?: {
				getToken(): Promise<string | null>;
				refresh(): Promise<void>;
			};
			signOut(): Promise<void>;
		};
	}
}

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || '',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Preserve existing Clerk auth interceptor
apiClient.interceptors.request.use(
	async (config) => {
		// Get auth token from Clerk
		const token = await window.__clerk?.session?.getToken();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Keep existing auth error handling
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 errors with Clerk token refresh
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Attempt to refresh token
				await window.__clerk?.session?.refresh();

				// Retry request with new token
				const token = await window.__clerk?.session?.getToken();
				if (token) {
					originalRequest.headers.Authorization = `Bearer ${token}`;
				}

				return apiClient(originalRequest);
			} catch (refreshError) {
				// Handle refresh failure
				await window.__clerk?.signOut?.();
				return Promise.reject(refreshError);
			}
		}

		// Add general error handling
		const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
		if (error.response?.status !== 401) {
			toast({
				title: 'Error',
				description: errorMessage,
				variant: 'destructive',
			});
		}

		return Promise.reject(error);
	}
);

// Keep the timeout wrapper
const withTimeout = <T>(promise: Promise<T>): Promise<T> => {
	const timeoutPromise = new Promise<T>((_, reject) => {
		setTimeout(() => {
			reject(new Error('Request timeout'));
		}, 10000);
	});

	return Promise.race([promise, timeoutPromise]);
};

// Wrap axios instance methods with timeout
const wrappedApiClient = {
	get: <T>(url: string, config?: AxiosRequestConfig) => 
		withTimeout(apiClient.get<T>(url, config)),
	post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
		withTimeout(apiClient.post<T>(url, data, config)),
	put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
		withTimeout(apiClient.put<T>(url, data, config)),
	delete: <T>(url: string, config?: AxiosRequestConfig) => 
		withTimeout(apiClient.delete<T>(url, config)),
	patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
		withTimeout(apiClient.patch<T>(url, data, config)),
};

export { wrappedApiClient as apiClient };
