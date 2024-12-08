import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Project } from '@/src/types/project.types';
import type { UseQueryResult } from '@tanstack/react-query';

export const useProjectDetails = (projectId: string): UseQueryResult<Project, Error> =>
	useQuery({
		queryKey: ['projectDetails', projectId],
		queryFn: async () => {
			return apiClient.get<Project>(`/projects/${projectId}`);
		},
		enabled: !!projectId,
	});
