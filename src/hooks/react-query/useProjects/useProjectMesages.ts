import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';

export const useProjectMessages = (projectId: string) =>
	useQuery({
		queryKey: ['projectMessages', projectId],
		queryFn: async () => {
			return apiClient.get(`/projects/${projectId}/messages`);
		},
		enabled: !!projectId, // Fetch only if projectId is provided
	});
