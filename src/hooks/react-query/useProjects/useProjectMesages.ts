import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Message } from '@/src/types/message.types';
import type { UseQueryResult } from '@tanstack/react-query';

export const useProjectMessages = (projectId: string): UseQueryResult<Message[], Error> =>
	useQuery({
		queryKey: ['projectMessages', projectId],
		queryFn: async () => {
			return apiClient.get<Message[]>(`/projects/${projectId}/messages`);
		},
		enabled: !!projectId,
	});
