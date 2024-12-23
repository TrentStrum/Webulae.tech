import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { ScopeChangeRequest } from '@/src/types/scopeChange.types';

export function useProjectScopeChanges(projectId: string): UseQueryResult<ApiResponse<ScopeChangeRequest[]>, ApiError> {
	return useApiQuery<ScopeChangeRequest[]>(
		queryKeys.scopeChanges.byProject(projectId),
		endpoints.scopeChanges.byProject(projectId),
		undefined,
		{ enabled: !!projectId }
	);
} 