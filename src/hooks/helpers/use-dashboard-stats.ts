'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/src/lib/apiClient';

import { useAuthState } from '../auth/useAuthState';

type Project = {
	status: string;
};

type Profile = {
	role: string;
};

type ApiResponse<T> = {
	data: T[] | null;
	error: Error | null;
};

export function useDashboardStats(): {
	projectStats: { total: number; active: number; completed: number };
	userStats: { total: number; clients: number; developers: number };
	isLoading: boolean;
	error: Error | null;
} {
	const { user, loading: isLoadingAuth } = useAuthState();
	const router = useRouter();

	const { data, isLoading, error } = useQuery({
		queryKey: ['dashboard', 'stats'],
		queryFn: async (): Promise<{
			projectStats: { total: number; active: number; completed: number };
			userStats: { total: number; clients: number; developers: number };
		}> => {
			if (!user || user.role !== 'admin') {
				router.push('/');
				throw new Error('Unauthorized');
			}

			const [projectsResult, usersResult] = await Promise.all([
				apiClient.get<ApiResponse<Project>>('/projects'),
				apiClient.get<ApiResponse<Profile>>('/profiles'),
			]);

			if (projectsResult.error) throw projectsResult.error;
			if (usersResult.error) throw usersResult.error;

			return {
				projectStats: {
					total: projectsResult.data?.length || 0,
					active: projectsResult.data?.filter((p) => p.status !== 'completed').length || 0,
					completed: projectsResult.data?.filter((p) => p.status === 'completed').length || 0,
				},
				userStats: {
					total: usersResult.data?.length || 0,
					clients: usersResult.data?.filter((u) => u.role === 'client').length || 0,
					developers: usersResult.data?.filter((u) => u.role === 'developer').length || 0,
				},
			};
		},
		enabled: !isLoadingAuth && !!user && user.role === 'admin',
	});

	return {
		projectStats: data?.projectStats || { total: 0, active: 0, completed: 0 },
		userStats: data?.userStats || { total: 0, clients: 0, developers: 0 },
		isLoading: isLoadingAuth || isLoading,
		error,
	};
}
