import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { ProjectMember } from '@/src/types/project.types';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export const useProjectMembers = (projectId: string): UseQueryResult<ProjectMember[], Error> =>
	useQuery({
		queryKey: ['projectMembers', projectId],
		queryFn: async () => {
			return apiClient.get(`/projects/${projectId}/members`);
		},
		enabled: !!projectId,
	});

export const useAddProjectMember = (): UseMutationResult<
	ProjectMember,
	Error,
	{ projectId: string; userId: string; role: string }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			projectId,
			userId,
			role,
		}: {
			projectId: string;
			userId: string;
			role: string;
		}) => {
			return await apiClient.post<ProjectMember>(`/projects/${projectId}/members`, {
				userId,
				role,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['projectMembers', variables.projectId],
			});
		},
	});
};
