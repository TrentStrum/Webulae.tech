import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Project } from '@/src/types/project.types';

export const useDeveloperProjects = () =>
	useQuery<Project[]>({
		queryKey: ['developerProjects'],
		queryFn: async () => {
			const response = await apiClient.get<Project[]>('/developer/projects');
			return response;
		},
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
