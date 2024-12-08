import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { TimelineItem } from '@/src/types/timeline.types';
import type { UseQueryResult } from '@tanstack/react-query';

export const useProjectTimeline = (projectId: string): UseQueryResult<TimelineItem[], Error> =>
	useQuery({
		queryKey: ['projectTimeline', projectId],
		queryFn: async () => {
			const response = await apiClient.get<TimelineItem[]>(`/projects/${projectId}/timeline`);
			return response;
		},
		enabled: !!projectId, // Only fetch if projectId is available
	});
