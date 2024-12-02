import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';

export const useProjectMembers = (projectId: string) =>
	useQuery({
		queryKey: ['projectMembers', projectId],
		queryFn: async () => {
			return apiClient.get(`/projects/${projectId}/members`);
		},
		enabled: !!projectId, // Fetch only if projectId is provided
	});

export const useAddProjectMember = () => {
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
			await apiClient.post(`/projects/${projectId}/members`, { userId, role });
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['projectMembers', variables.projectId]
			});
		},
	});
};
