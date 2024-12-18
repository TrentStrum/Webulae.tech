import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Project } from '@/src/types/project.types';
import type { UseQueryResult } from '@tanstack/react-query';

export const useProjects = (): UseQueryResult<Project[], Error> =>
	useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await apiClient.get<Project[]>('/admin/projects');
			return response || [];
		},
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
