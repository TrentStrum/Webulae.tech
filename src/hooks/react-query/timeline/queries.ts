import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery, useApiPaginatedQuery } from '../base-queries';

import type { ApiResponse, PaginatedResponse, ApiError } from '@/src/types/api.types';
import type { TimelineEvent } from '@/src/types/timeline.types';

export function useProjectTimeline(projectId: string): UseQueryResult<ApiResponse<TimelineEvent[]>, ApiError> {
	return useApiQuery<TimelineEvent[]>(
		queryKeys.timeline.byProject(projectId),
		endpoints.timeline.byProject(projectId),
		undefined,
		{ enabled: !!projectId }
	);
}

export function useTimelineEvents(): UseQueryResult<PaginatedResponse<TimelineEvent>, ApiError> {
	return useApiPaginatedQuery<TimelineEvent>(
		queryKeys.timeline.all,
		endpoints.timeline.base
	);
} 