import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';

interface Message {
	id: string;
	projectId: string;
	sender: string;
	recipient: string;
	subject: string;
	content: string;
	status: string;
	createdAt: string;
}

export const useProjectMessages = (projectId: string) =>
	useQuery<Message[]>({
		queryKey: ['projectMessages', projectId],
		queryFn: async () => {
			const response = await apiClient.get<{ data: Message[] }>(`/projects/${projectId}/messages`);
			return response.data;
		},
		enabled: !!projectId, // Only fetch if projectId is available
	});
