import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { apiClient } from '@/src/lib/apiClient';

import { useApiMutation } from '../base-queries';

import type { AnalyticsEvent } from '@/src/types/analytics.types';
import type { ApiResponse, ApiError } from '@/src/types/api.types';


export function useTrackEvent(): UseMutationResult<
	ApiResponse<void>,
	ApiError,
	AnalyticsEvent
> {
	return useApiMutation<void, AnalyticsEvent>(
		endpoints.analytics.events,
		{
			mutationFn: async (event) => {
				const { data } = await apiClient.post<ApiResponse<void>>(endpoints.analytics.events, event);
				return data;
			}
		}
	);
} 