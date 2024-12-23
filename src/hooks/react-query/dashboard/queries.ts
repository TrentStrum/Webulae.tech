import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiError, ApiResponse } from '@/src/types/api.types';
import type { Activity, ActivityParams, SearchResult } from '@/src/types/dashboard.types';
import type { UseQueryResult } from '@tanstack/react-query';

export function useActivity(params?: ActivityParams): UseQueryResult<ApiResponse<Activity[]>, ApiError> {
  return useApiQuery<Activity[]>(
    queryKeys.dashboard.activity(params),
    endpoints.dashboard.activity,
    {
      enabled: true
    }
  );
}

export function useSearch(query: string): UseQueryResult<ApiResponse<SearchResult[]>, ApiError> {
  return useApiQuery<SearchResult[]>(
    queryKeys.dashboard.search(query),
    endpoints.dashboard.search,
    {
      enabled: query.length > 0
    }
  );
} 