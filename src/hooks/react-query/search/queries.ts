import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { SearchResults } from '@/src/types/search.types';

export function useSearch(query: string): UseQueryResult<ApiResponse<SearchResults>, ApiError> {
	return useApiQuery<SearchResults>(
		queryKeys.search.query(query),
		endpoints.search.base,
		{ search: query },
		{ enabled: !!query }
	);
} 