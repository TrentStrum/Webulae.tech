import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryClient } from '@/src/config/query-client';
import { queryKeys } from '@/src/config/query-keys';

import { useApiMutation } from '../base-queries';

import type { Message } from '@/src/types';
import type { ApiResponse, ApiError } from '@/src/types/api.types';

export function useCreateMessage(): UseMutationResult<
	ApiResponse<Message>,
	ApiError,
	{ projectId: string; content: string }
> {
	return useApiMutation<Message, { projectId: string; content: string }>(
		endpoints.messages.base,
		{
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.messages.byProject(variables.projectId)
				});
			}
		}
	);
} 