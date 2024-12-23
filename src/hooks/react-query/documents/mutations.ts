import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryClient } from '@/src/config/query-client';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';

import { useApiMutation } from '../base-queries';

import type { Document } from '@/src/types';
import type { ApiResponse, ApiError } from '@/src/types/api.types';

export function useUploadDocument(): UseMutationResult<
	ApiResponse<Document>,
	ApiError,
	{ projectId: string; file: File; category: string; metadata?: Record<string, unknown> }
> {
	return useApiMutation<Document, { projectId: string; file: File; category: string; metadata?: Record<string, unknown> }>(
		endpoints.documents.base,
		{
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.documents.byProject(variables.projectId)
				});
			}
		}
	);
}

export function useDeleteDocument(): UseMutationResult<ApiResponse<void>, ApiError, string> {
	return useApiMutation<void, string>(
		endpoints.documents.base,
		{
			mutationFn: async (documentId) => {
				const response = await apiClient.delete<ApiResponse<void>>(`${endpoints.documents.base}/${documentId}`);
				return response.data;
			}
		}
	);
} 