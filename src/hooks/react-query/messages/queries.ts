import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery, useApiPaginatedQuery } from '../base-queries';

import type { Message } from '@/src/types';
import type { ApiResponse, PaginatedResponse, ApiError } from '@/src/types/api.types';

export function useMessages(): UseQueryResult<PaginatedResponse<Message>, ApiError> {
	return useApiPaginatedQuery<Message>(
		queryKeys.messages.all,
		endpoints.messages.base
	);
}

export function useProjectMessages(projectId: string): UseQueryResult<ApiResponse<Message[]>, ApiError> {
	return useApiQuery<Message[]>(
		queryKeys.messages.byProject(projectId),
		endpoints.messages.byProject(projectId),
		undefined,
		{ enabled: !!projectId }
	);
} 