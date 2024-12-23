import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Profile } from '@/src/types/profile.types';

export function useProfile(): UseQueryResult<ApiResponse<Profile>, ApiError> {
	return useApiQuery<Profile>(
		queryKeys.profile.current,
		endpoints.profile.current
	);
}

export function useProfileByUserId(userId: string): UseQueryResult<ApiResponse<Profile>, ApiError> {
	return useApiQuery<Profile>(
		queryKeys.profile.detail(userId),
		endpoints.profile.detail(userId),
		undefined,
		{ enabled: !!userId }
	);
} 