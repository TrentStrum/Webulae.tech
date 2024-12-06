import { useQuery, useMutation } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Message } from '@/src/types/message.types';
import type { QueryClient } from '@tanstack/react-query';

export const useMessages = (projectId: string) =>
	useQuery({
		queryKey: ['messages', projectId],
		queryFn: async () => apiClient.get<Message[]>(`/projects/${projectId}/messages`),
	});

export const useSendMessage = (queryClient: QueryClient) =>
	useMutation({
		mutationFn: async (data: {
			projectId: string;
			recipientId: string;
			subject: string;
			content: string;
		}) => apiClient.post(`/projects/${data.projectId}/messages`, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['messages', variables.projectId] });
		},
	});
