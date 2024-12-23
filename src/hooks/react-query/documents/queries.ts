import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery, useApiPaginatedQuery } from '../base-queries';

import type { Document } from '@/src/types';
import type { ApiResponse, PaginatedResponse, ApiError } from '@/src/types/api.types';

export function useDocuments(): UseQueryResult<PaginatedResponse<Document>, ApiError> {
	return useApiPaginatedQuery<Document>(
		queryKeys.documents.all,
		endpoints.documents.base
	);
}

export function useProjectDocuments(projectId: string): UseQueryResult<ApiResponse<Document[]>, ApiError> {
	return useApiQuery<Document[]>(
		queryKeys.documents.byProject(projectId),
		endpoints.documents.byProject(projectId),
		undefined,
		{ enabled: !!projectId }
	);
} 