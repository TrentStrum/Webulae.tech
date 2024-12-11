import axios from 'axios';

import { withTimeout } from './helpers';

import type { Profile } from '@/src/types/user.types';
import type { AxiosError } from 'axios';

declare module 'axios' {
	export interface InternalAxiosRequestConfig {
		retryCount?: number;
	}
}

// Create axios instance with default config
const axiosInstance = axios.create({
	baseURL: '/',
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
	(response) => response.data,
	async (error: AxiosError) => {
		const config = error.config;

		// Retry logic for specific status codes
		if (
			config &&
			error.response &&
			[408, 429, 500, 502, 503, 504].includes(error.response.status) &&
			config.retryCount &&
			config.retryCount < 3
		) {
			config.retryCount = (config.retryCount || 0) + 1;
			const delay = Math.min(1000 * 2 ** config.retryCount, 10000);

			await new Promise((resolve) => setTimeout(resolve, delay));
			return axiosInstance(config);
		}

		return Promise.reject(error);
	}
);

interface AuthStateChangeEvent {
	event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED';
	session: { user: { id: string } } | null;
}

export const apiClient = {
	get: async <T>(url: string, config?: object): Promise<T> => {
		try {
			const response = await withTimeout<T>(axiosInstance.get(url, config));
			return response;
		} catch (error) {
			handleApiError(error);
			throw error;
		}
	},

	post: async <TResponse, TPayload = unknown>(
		url: string,
		payload?: TPayload,
		config?: object
	): Promise<TResponse> => {
		try {
			const response = await withTimeout(axiosInstance.post<TResponse>(url, payload, config));
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

	auth: {
		onAuthStateChange(callback: AuthEventCallback): { subscription: AuthSubscription } {
			let retryCount = 0;
			const MAX_RETRIES = 3;
			const RETRY_DELAY = 5000;

			function setupEventSource(): EventSource {
				const eventSource = new EventSource('/api/auth/events', {
					withCredentials: true,
				});

				eventSource.onopen = (): void => {
					retryCount = 0;
					// eslint-disable-next-line no-console
					console.debug('Auth state change connection established');
				};

				eventSource.onmessage = async (event: MessageEvent): Promise<void> => {
					try {
						const data = JSON.parse(event.data) as AuthStateChangeEvent;
						await callback(data.event, data.session);
					} catch (error) {
						// eslint-disable-next-line no-console
						console.error('Error processing auth state change:', error);
					}
				};

				eventSource.onerror = (error: Event): void => {
					// eslint-disable-next-line no-console
					console.error('Auth state change connection error:', error);
					if (eventSource.readyState === EventSource.CLOSED) {
						eventSource.close();
						if (retryCount < MAX_RETRIES) {
							retryCount++;
							setTimeout(() => {
								setupEventSource();
							}, RETRY_DELAY);
						}
					}
				};

				return eventSource;
			}

			const eventSource = setupEventSource();

			const subscription: AuthSubscription = {
				unsubscribe: (): void => {
					eventSource.close();
				},
			};

			return { subscription };
		},

		async getProfile<T = Profile>(): Promise<{ data: T }> {
			const response = await apiClient.get<T>('/auth/profile');
			return { data: response };
		},
	},
};

interface EnhancedError extends Error {
	status?: number;
	code?: string;
}

function handleApiError(error: unknown): never {
	if (axios.isAxiosError(error)) {
		const enhancedError = new Error(
			error.response?.data?.message || error.message
		) as EnhancedError;
		enhancedError.status = error.response?.status;
		enhancedError.code = error.code;
		throw enhancedError;
	}
	throw error;
}

type AuthEventCallback = (
	event: AuthStateChangeEvent['event'],
	session: AuthStateChangeEvent['session']
) => Promise<void>;

interface AuthSubscription {
	unsubscribe: () => void;
}
