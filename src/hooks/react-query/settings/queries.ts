import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Settings } from '@/src/types/settings.types';

export function useUserSettings(): UseQueryResult<ApiResponse<Settings>, ApiError> {
	return useApiQuery<Settings>(
		queryKeys.settings.user,
		endpoints.settings.user
	);
}

export function useProjectSettings(projectId: string): UseQueryResult<ApiResponse<Settings>, ApiError> {
	return useApiQuery<Settings>(
		queryKeys.settings.project(projectId),
		endpoints.settings.project(projectId),
		undefined,
		{ enabled: !!projectId }
	);
} 