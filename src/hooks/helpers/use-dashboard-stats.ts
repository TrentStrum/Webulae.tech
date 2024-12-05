'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';

export function useDashboardStats() {
	const { data: user, isLoading: isLoadingAuth } = useAuth();
	const router = useRouter();

	const { data, isLoading, error } = useQuery({
		queryKey: ['dashboard', 'stats'],
		queryFn: async () => {
			if (!user || user.role !== 'admin') {
				router.push('/');
				throw new Error('Unauthorized');
			}

			const [projectsResult, usersResult] = await Promise.all([
				supabase.from('projects').select('status'),
				supabase.from('profiles').select('role'),
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
