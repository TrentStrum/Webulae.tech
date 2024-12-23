import { useInfiniteQuery } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';

import type { ApiResponse, PaginationParams , ApiError } from '@/src/types/api.types';
import type { Member } from '@/src/types/member.types';
import type { InfiniteData , UseInfiniteQueryResult } from '@tanstack/react-query';

export interface UseInfiniteListParams extends PaginationParams {
	enabled?: boolean;
	limit?: number;
	[key: string]: unknown;
}

export function useInfiniteList<T>(
	queryKey: readonly unknown[],
	endpoint: string,
	{ limit = 10, enabled = true, ...params }: UseInfiniteListParams = {}
): UseInfiniteQueryResult<InfiniteData<ApiResponse<T[]>>, Error> {
	return useInfiniteQuery<ApiResponse<T[]>, Error, InfiniteData<ApiResponse<T[]>>, readonly unknown[], number>({
		queryKey,
		queryFn: async ({ pageParam = 1 }) => {
			const response = await apiClient.get<ApiResponse<T[]>>(endpoint, {
				params: {
					...params,
					page: pageParam,
					limit,
				},
			});
			return response.data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam) => {
			if (!lastPage.meta?.hasMore) return undefined;
			return lastPageParam + 1;
		},
		enabled,
	});
}

export function flattenInfiniteQueryData<T>(data: InfiniteData<ApiResponse<T[]>> | undefined): T[] {
	if (!data) return [];
	return data.pages.flatMap(page => page.data);
}

// Usage example for members list
export function useInfiniteMembersList(
	orgId: string, 
	params?: PaginationParams
): UseInfiniteQueryResult<InfiniteData<ApiResponse<Member[]>>, ApiError> & { members: Member[] } {
	const query = useInfiniteList<Member>(
		queryKeys.organizations.members(orgId),
		endpoints.organizations.members(orgId),
		params
	);

	return {
		...query,
		members: flattenInfiniteQueryData(query.data),
	};
}
