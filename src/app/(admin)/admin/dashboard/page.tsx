'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { DashboardSkeleton } from '@/src/components/skeletons/dashboard-skeleton';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { supabaseClient } from '@/src/lib/supabaseClient';
import { useRequireAdmin } from '@/src/hooks/react-query/useAuthMutations';

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

export default function AdminDashboard() {
	const [projectStats, setProjectStats] = useState<ProjectStats>({
		total: 0,
		active: 0,
		completed: 0,
	});
	const [userStats, setUserStats] = useState<UserStats>({ total: 0, clients: 0, developers: 0 });
	const [loading, setLoading] = useState(true);
	const { checkAdminAccess } = useRequireAdmin();
	const { toast } = useToast();

	useEffect(() => {
		const init = async () => {
			const hasAccess = await checkAdminAccess();
			if (hasAccess) {
				await loadStats();
			}
		};

		init();
	}, []);

	const loadStats = async () => {
		try {
			// Load project stats
			const { data: projects } = await supabaseClient.from('projects').select('status');

			const projectStats = {
				total: projects?.length || 0,
				active: projects?.filter((p) => p.status !== 'completed').length || 0,
				completed: projects?.filter((p) => p.status === 'completed').length || 0,
			};

			setProjectStats(projectStats);

			// Load user stats
			const { data: users } = await supabaseClient.from('profiles').select('role');

			const userStats = {
				total: users?.length || 0,
				clients: users?.filter((u) => u.role === 'client').length || 0,
				developers: users?.filter((u) => u.role === 'developer').length || 0,
			};

			setUserStats(userStats);
		} catch (error) {
			console.error('Error loading stats:', error);
			toast({
				title: 'Error',
				description: 'Failed to load dashboard statistics.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Admin Dashboard</h1>
				<div className="space-x-4">
					<Button asChild>
						<Link href="/admin/projects/new">
							<Plus className="mr-2 h-4 w-4" />
							New Project
						</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/admin/users">
							<Users className="mr-2 h-4 w-4" />
							Manage Users
						</Link>
					</Button>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3 mb-8">
				<Card>
					<CardHeader>
						<CardTitle>Total Projects</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{projectStats.total}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Active Projects</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{projectStats.active}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Completed Projects</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{projectStats.completed}</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-8 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button className="w-full justify-start" asChild>
							<Link href="/admin/projects">View All Projects</Link>
						</Button>
						<Button className="w-full justify-start" asChild>
							<Link href="/blog/admin">Manage Blog Posts</Link>
						</Button>
						<Button className="w-full justify-start" asChild>
							<Link href="/admin/settings">System Settings</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>User Statistics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span>Total Users</span>
								<Badge variant="secondary">{userStats.total}</Badge>
							</div>
							<div className="flex justify-between items-center">
								<span>Active Clients</span>
								<Badge variant="secondary">{userStats.clients}</Badge>
							</div>
							<div className="flex justify-between items-center">
								<span>Developers</span>
								<Badge variant="secondary">{userStats.developers}</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
