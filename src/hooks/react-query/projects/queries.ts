import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery, useApiPaginatedQuery } from '../base-queries';

import type { Project, ProjectMember } from '@/src/types';
import type { ApiResponse, PaginatedResponse, ApiError } from '@/src/types/api.types';


export function useProjects(): UseQueryResult<PaginatedResponse<Project>, ApiError> {
	return useApiPaginatedQuery<Project>(
		queryKeys.projects.all,
		endpoints.projects.base
	);
}

export function useDeveloperProjects(): UseQueryResult<PaginatedResponse<Project>, ApiError> {
	return useApiPaginatedQuery<Project>(
		queryKeys.projects.developer,
		endpoints.projects.developer
	);
}

export function useProjectDetails(projectId: string): UseQueryResult<ApiResponse<Project>, ApiError> {
	return useApiQuery<Project>(
		queryKeys.projects.detail(projectId),
		endpoints.projects.detail(projectId),
		undefined,
		{ enabled: !!projectId }
	);
}

export function useProjectMembers(projectId: string): UseQueryResult<ApiResponse<ProjectMember[]>, ApiError> {
	return useApiQuery<ProjectMember[]>(
		queryKeys.projects.members(projectId),
		endpoints.projects.members(projectId),
		undefined,
		{ enabled: !!projectId }
	);
}
