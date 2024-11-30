import { useState } from 'react';
import { supabaseClient } from '@/src/lib/supabaseClient';
import { useToast } from '@/src/hooks/helpers/use-toast';

interface ProjectStats {
	total: number;
	active: number;
	completed: number;
}

interface UserStats {
	total: number;
	clients: number;
	developers: number;
}

export function useDashboardStats() {
	const [projectStats, setProjectStats] = useState<ProjectStats>({
		total: 0,
		active: 0,
		completed: 0,
	});
	const [userStats, setUserStats] = useState<UserStats>({
		total: 0,
		clients: 0,
		developers: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const loadStats = async () => {
		setIsLoading(true);
		try {
			// Load project stats
			const { data: projects } = await supabaseClient.from('projects').select('status');
			const { data: users } = await supabaseClient.from('profiles').select('role');

			setProjectStats({
				total: projects?.length || 0,
				active: projects?.filter((p) => p.status !== 'completed').length || 0,
				completed: projects?.filter((p) => p.status === 'completed').length || 0,
			});

			setUserStats({
				total: users?.length || 0,
				clients: users?.filter((u) => u.role === 'client').length || 0,
				developers: users?.filter((u) => u.role === 'developer').length || 0,
			});
		} catch (error) {
			console.error('Error loading stats:', error);
			toast({
				title: 'Error',
				description: 'Failed to load dashboard statistics.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return {
		projectStats,
		userStats,
		isLoading,
		loadStats,
	};
}
