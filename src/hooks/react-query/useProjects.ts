'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { Project } from '@/src/types';

interface UseProjectsOptions {
	enabled?: boolean;
}

export function useProjects({ enabled = true }: UseProjectsOptions = {}): UseQueryResult<
	Project[]
> {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await apiClient.get<{ data: Project[] }>('/projects');
			return response.data;
		},
		enabled,
	});
}
