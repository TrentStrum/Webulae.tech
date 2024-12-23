import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryClient } from '@/src/config/query-client';
import { queryKeys } from '@/src/config/query-keys';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { TimelineEvent } from '@/src/types/timeline.types';

export function useCreateTimelineEvent(): UseMutationResult<
	ApiResponse<TimelineEvent>,
	ApiError,
	{ projectId: string; event: Omit<TimelineEvent, 'id' | 'createdAt'> }
> {
	return useApiMutation<TimelineEvent, { projectId: string; event: Omit<TimelineEvent, 'id' | 'createdAt'> }>(
		endpoints.timeline.base,
		{
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.timeline.byProject(variables.projectId)
				});
			}
		}
	);
} 