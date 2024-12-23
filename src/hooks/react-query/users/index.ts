import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { queryClient } from '@/src/lib/cache/queryCache';

import { useApiQuery, useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { User, UserPreferences } from '@/src/types/user.types';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export function useProfile(): UseQueryResult<ApiResponse<User>, ApiError> {
  return useApiQuery<User>(
    queryKeys.users.profile,
    endpoints.users.profile
  );
}

export function useUpdateProfile(): UseMutationResult<ApiResponse<User>, ApiError, Partial<User>> {
  return useApiMutation<ApiResponse<User>, Partial<User>>(
    endpoints.users.profile,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile
        });
      }
    }
  );
}

export function useUpdatePreferences(): UseMutationResult<ApiResponse<UserPreferences>, ApiError, Partial<UserPreferences>> {
  return useApiMutation<ApiResponse<UserPreferences>, Partial<UserPreferences>>(
    endpoints.users.preferences,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.preferences
        });
      }
    }
  );
}

export * from './queries';
export * from './mutations';

