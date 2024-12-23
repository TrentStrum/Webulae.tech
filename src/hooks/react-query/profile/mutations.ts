import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { queryClient } from '@/src/lib/cache/queryCache';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Profile } from '@/src/types/profile.types';

export function useUpdateProfile(): UseMutationResult<
	ApiResponse<Profile>,
	ApiError,
	Partial<Profile>
> {
	return useApiMutation<Profile, Partial<Profile>>(
		endpoints.profile.current,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.profile.current
				});
			}
		}
	);
} 