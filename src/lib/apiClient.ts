import axios, { AxiosResponse, AxiosError } from 'axios';

// Add base URL configuration
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // adjust this
});

// Add request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		// You can add auth headers or other request modifications here
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Add response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		console.error('Response error:', {
			status: error.response?.status,
			message: error.message,
			url: error.config?.url
		});
		return Promise.reject(error);
	}
);

export const apiClient = {
	get: async <T>(url: string, config?: object): Promise<T> => {
		try {
			const { data } = await axiosInstance.get<T>(url, config);
			return data;
		} catch (error) {
			console.error(`GET ${url} failed:`, error);
			throw error;
		}
	},
	post: async <TPayload = unknown, TResponse = TPayload>(
		url: string,
		payload?: TPayload,
		config?: object,
	): Promise<TResponse> => {
		try {
			const { data } = await axiosInstance.post<TPayload, AxiosResponse<TResponse>>(
				url,
				payload,
				config,
			);
			return data;
		} catch (error) {
			console.error(`POST ${url} failed:`, error);
			throw error;
		}
	},
	put: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
		try {
			const { data } = await axiosInstance.put<T>(url, payload, config);
			return data;
		} catch (error) {
			console.error(`PUT ${url} failed:`, error);
			throw error;
		}
	},
	patch: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
		try {
			const { data } = await axiosInstance.patch<T>(url, payload, config);
			return data;
		} catch (error) {
			console.error(`PATCH ${url} failed:`, error);
			throw error;
		}
	},
	delete: async <T>(url: string, config?: object): Promise<T> => {
		try {
			const { data } = await axiosInstance.delete<T>(url, config);
			return data;
		} catch (error) {
			console.error(`DELETE ${url} failed:`, error);
			throw error;
		}
	},
};
