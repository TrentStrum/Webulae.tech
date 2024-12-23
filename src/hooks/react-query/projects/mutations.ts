import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryClient } from '@/src/config/query-client';
import { apiClient } from '@/src/lib/apiClient';

import { useApiMutation } from '../base-queries';

import type { Project, ProjectMember } from '@/src/types';
import type { ApiResponse, ApiError } from '@/src/types/api.types';

export function useCreateProject(): UseMutationResult<
	ApiResponse<Project>,
	ApiError,
	Omit<Project, 'id' | 'created_at' | 'updated_at'>
> {
	return useApiMutation<Project, Omit<Project, 'id' | 'created_at' | 'updated_at'>>(
		endpoints.projects.base
	);
}

export function useUpdateProject(): UseMutationResult<
	ApiResponse<Project>,
	ApiError,
	{ id: string; data: Partial<Project> }
> {
	return useApiMutation<Project, { id: string; data: Partial<Project> }>(
		endpoints.projects.base,
		{
			mutationFn: async ({ id, data }) => {
				const response = await apiClient.patch<ApiResponse<Project>>(
					endpoints.projects.detail(id),
					data
				);
				return response.data;
			}
		}
	);
}

export function useDeleteProject(): UseMutationResult<ApiResponse<void>, ApiError, string> {
	return useApiMutation<void, string>(endpoints.projects.base, {
		mutationFn: async (projectId) => {
			const response = await apiClient.delete<ApiResponse<void>>(endpoints.projects.detail(projectId));
			return response.data;
		}
	});
}

export function useAddProjectMember(): UseMutationResult<
	ApiResponse<ProjectMember>,
	ApiError,
	{ projectId: string; userId: string; role: string }
> {
	return useApiMutation<ProjectMember, { projectId: string; userId: string; role: string }>(
		endpoints.projects.base,
		{
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: ['projectMembers', variables.projectId]
				});
			}
		}
	);
} 