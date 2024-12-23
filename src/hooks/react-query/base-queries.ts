import { useQuery, useMutation } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { ApiResponse, ApiError, PaginatedResponse } from '@/src/types/api.types';
import type { UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query';


export function useApiQuery<TData>(
	queryKey: readonly unknown[],
	endpoint: string,
	options: Omit<UseQueryOptions<ApiResponse<TData>, ApiError>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<ApiResponse<TData>, ApiError> {
	return useQuery<ApiResponse<TData>, ApiError>({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<TData>>(endpoint);
			return response.data;
		},
		...options,
	});
}

export function useApiPaginatedQuery<TData>(
	queryKey: readonly unknown[],
	endpoint: string,
	params?: Record<string, unknown>,
	options: Omit<UseQueryOptions<PaginatedResponse<TData>, ApiError>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<PaginatedResponse<TData>, ApiError> {
	return useQuery<PaginatedResponse<TData>, ApiError>({
		queryKey,
		queryFn: async () => {
			const response = await apiClient.get<PaginatedResponse<TData>>(endpoint, { params });
			return response.data;
		},
		...options,
	});
}

export function useApiMutation<TData, TVariables, TContext = unknown>(
	endpoint: string,
	options?: UseMutationOptions<TData, ApiError, TVariables, TContext>
): UseMutationResult<TData, ApiError, TVariables, TContext> {
	return useMutation<TData, ApiError, TVariables, TContext>({
		mutationFn: async (data) => {
			const response = await apiClient.post<TData>(endpoint, data);
			return response.data;
		},
		...options,
	});
}
