import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { Analytics } from '@/src/types/analytics.types';
import type { ApiResponse, ApiError } from '@/src/types/api.types';

export function useProjectAnalytics(projectId: string): UseQueryResult<ApiResponse<Analytics>, ApiError> {
	return useApiQuery<Analytics>(
		queryKeys.analytics.project(projectId),
		endpoints.analytics.project(projectId),
		undefined,
		{ enabled: !!projectId }
	);
}

export function useUserAnalytics(): UseQueryResult<ApiResponse<Analytics>, ApiError> {
	return useApiQuery<Analytics>(
		queryKeys.analytics.user,
		endpoints.analytics.user
	);
} 