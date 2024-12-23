import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';
import { queryClient } from '@/src/lib/cache/queryCache';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { User } from '@/src/types/user.types';

export function useUpdateUser(): UseMutationResult<
	ApiResponse<User>,
	ApiError,
	{ id: string; data: Partial<User> }
> {
	return useApiMutation<User, { id: string; data: Partial<User> }>(
		endpoints.users.base,
		{
			mutationFn: async ({ id, data }) => {
				const response = await apiClient.patch<ApiResponse<User>>(
					endpoints.users.detail(id),
					data
				);
				return response.data;
			},
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.users.detail(variables.id)
				});
				queryClient.invalidateQueries({
					queryKey: queryKeys.users.all
				});
			}
		}
	);
} 