import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { Project } from '@/src/types/project.types';

export const useProjects = () =>
	useQuery<Project[]>({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await apiClient.get<Project[]>('/admin/projects');
			return response || [];
		},
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
