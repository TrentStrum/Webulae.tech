import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery, useApiPaginatedQuery } from '../base-queries';

import type { ApiResponse, PaginatedResponse, ApiError } from '@/src/types/api.types';
import type { User } from '@/src/types/user.types';

export function useUsers(): UseQueryResult<PaginatedResponse<User>, ApiError> {
	return useApiPaginatedQuery<User>(
		queryKeys.users.all,
		endpoints.users.base
	);
}

export function useUser(userId: string): UseQueryResult<ApiResponse<User>, ApiError> {
	return useApiQuery<User>(
		queryKeys.users.detail(userId),
		endpoints.users.detail(userId),
		undefined,
		{ enabled: !!userId }
	);
} 