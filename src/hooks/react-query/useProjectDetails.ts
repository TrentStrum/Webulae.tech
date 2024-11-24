import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { Project } from '@/src/types/project.types';

export const useProjectDetails = (projectId: string) =>
	useQuery({
		queryKey: ['projectDetails', projectId],
		queryFn: async () => {
			const response = await apiClient.get<Project>(`/projects/${projectId}`);
			return response;
		},
		enabled: !!projectId, // Only fetch if projectId is available
	});
