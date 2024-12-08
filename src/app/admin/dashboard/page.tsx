'use client';

import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { DashboardSkeleton } from '@/src/components/skeletons/dashboard-skeleton';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useDashboardStats } from '@/src/hooks/helpers/use-dashboard-stats';
import { useAuth } from '@/src/hooks/useAuth';

export default function AdminDashboard() {
	const { projectStats, userStats, isLoading: isLoadingStats, error } = useDashboardStats();
	const [isCheckingAccess, setIsCheckingAccess] = useState(true);
	const { user, loading: isLoadingAuth } = useAuth();

	useEffect(() => {
		const checkAccess = async () => {
			if (!isLoadingAuth && !user) {
				window.location.replace('/auth/login');
				return;
			}

			if (user && user.role !== 'admin') {
				window.location.replace('/');
				return;
			}

			setIsCheckingAccess(false);
		};

		checkAccess();
	}, [user, isLoadingAuth]);

	if (isCheckingAccess || isLoadingStats || isLoadingAuth) {
		return <DashboardSkeleton />;
	}

	if (error) {
		return <div>Error loading dashboard data</div>;
	}

	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">{`${user?.full_name}'s Dashboard`}</h1>
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
