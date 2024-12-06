import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Message } from '@/src/types/message.types';

export const useProjectMessages = (projectId: string) =>
	useQuery<Message[]>({
		queryKey: ['projectMessages', projectId],
		queryFn: async () => {
			return apiClient.get<Message[]>(`/projects/${projectId}/messages`);
		},
		enabled: !!projectId, // Fetch only if projectId is provided
	});
