import axios, { AxiosResponse } from 'axios';

// Add base URL configuration
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // adjust this
});

export const apiClient = {
	get: async <T>(url: string, config?: object): Promise<T> => {
		const { data } = await axiosInstance.get<T>(url, config);
		return data;
	},
	post: async <TPayload = unknown, TResponse = TPayload>(
		url: string,
		payload?: TPayload,
		config?: object,
	): Promise<TResponse> => {
		const { data } = await axiosInstance.post<TPayload, AxiosResponse<TResponse>>(
			url,
			payload,
			config,
		);
		return data;
	},
	put: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
		const { data } = await axiosInstance.put<T>(url, payload, config);
		return data;
	},
	patch: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
		const { data } = await axiosInstance.patch<T>(url, payload, config);
		return data;
	},
	delete: async <T>(url: string, config?: object): Promise<T> => {
		const { data } = await axiosInstance.delete<T>(url, config);
		return data;
	},
};
