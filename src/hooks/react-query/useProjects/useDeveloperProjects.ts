import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Project } from '@/src/types/project.types';
import type { UseQueryResult } from '@tanstack/react-query';

export const useDeveloperProjects = (): UseQueryResult<Project[], Error> =>
	useQuery({
		queryKey: ['developerProjects'],
		queryFn: async () => {
			return await apiClient.get<Project[]>('/developer/projects');
		},
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
