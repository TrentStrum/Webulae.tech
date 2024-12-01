import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { Project } from '@/src/types/project.types';

export const useProjectDetails = (projectId: string) =>
	useQuery<Project>({
		queryKey: ['projectDetails', projectId],
		queryFn: async () => {
			return apiClient.get<Project>(`/projects/${projectId}`);
		},
		enabled: !!projectId, // Fetch only if projectId is provided
	});
