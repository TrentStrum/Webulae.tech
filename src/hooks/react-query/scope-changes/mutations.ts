import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';
import { queryClient } from '@/src/lib/cache/queryCache';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { ScopeChangeRequest } from '@/src/types/scopeChange.types';

export function useCreateScopeChange(): UseMutationResult<
	ApiResponse<ScopeChangeRequest>,
	ApiError,
	{ projectId: string; data: Omit<ScopeChangeRequest, 'id'> }
> {
	return useApiMutation<ScopeChangeRequest, { projectId: string; data: Omit<ScopeChangeRequest, 'id'> }>(
		endpoints.scopeChanges.base,
		{
			mutationFn: async ({ projectId, data }) => {
				const response = await apiClient.post<ApiResponse<ScopeChangeRequest>>(
					endpoints.scopeChanges.byProject(projectId),
					data
				);
				return response.data;
			},
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.scopeChanges.byProject(variables.projectId)
				});
			}
		}
	);
} 