import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryClient } from '@/src/config/query-client';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Settings } from '@/src/types/settings.types';

export function useUpdateUserSettings(): UseMutationResult<
	ApiResponse<Settings>,
	ApiError,
	Partial<Settings>
> {
	return useApiMutation<Settings, Partial<Settings>>(
		endpoints.settings.user,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.settings.user
				});
			}
		}
	);
}

export function useUpdateProjectSettings(): UseMutationResult<
	ApiResponse<Settings>,
	ApiError,
	{ projectId: string; settings: Partial<Settings> }
> {
	return useApiMutation<Settings, { projectId: string; settings: Partial<Settings> }>(
		endpoints.settings.base,
		{
			mutationFn: async ({ projectId, settings }) => {
				const response = await apiClient.patch<ApiResponse<Settings>>(
					endpoints.settings.project(projectId),
					settings
				);
				return response.data;
			},
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.settings.project(variables.projectId)
				});
			}
		}
	);
} 