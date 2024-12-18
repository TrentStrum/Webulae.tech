import {
	useQuery,
	useMutation,
	type UseMutationResult,
	type UseQueryResult,
	type QueryClient,
} from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Message } from '@/src/types/message.types';

export const useMessages = (projectId: string): UseQueryResult<Message[], Error> =>
	useQuery({
		queryKey: ['messages', projectId],
		queryFn: async () => apiClient.get<Message[]>(`/projects/${projectId}/messages`),
	});

type SendMessageData = {
	projectId: string;
	recipientId: string;
	subject: string;
	content: string;
};

export const useSendMessage = (
	queryClient: QueryClient
): UseMutationResult<void, Error, SendMessageData> =>
	useMutation({
		mutationFn: async (data) => apiClient.post(`/projects/${data.projectId}/messages`, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['messages', variables.projectId] });
		},
	});
