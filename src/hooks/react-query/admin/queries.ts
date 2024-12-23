import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery, useApiPaginatedQuery } from '../base-queries';

import type { AdminStats, Member } from '@/src/types/admin.types';
import type { AdminMembersParams , ApiResponse, ApiError, PaginatedResponse } from '@/src/types/api.types';
import type { UseQueryResult } from '@tanstack/react-query';


export function useAdminStats(): UseQueryResult<ApiResponse<AdminStats>, ApiError> {
	return useApiQuery<AdminStats>(
		queryKeys.admin.stats,
		endpoints.admin.stats
	);
}

export function useAdminMembers(params?: AdminMembersParams): UseQueryResult<PaginatedResponse<Member>, ApiError> {
	return useApiPaginatedQuery<Member>(
		queryKeys.admin.members(params),
		endpoints.admin.members,
		params
	);
}
