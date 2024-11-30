'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { ProjectCardSkeleton } from '@/src/components/skeletons/project-card-skeleton';
import { useToast } from '@/src/hooks';
import { supabaseClient } from '@/src/lib/supabaseClient';

interface Project {
	id: string;
	name: string;
	description: string;
	status: string;
	updated_at: string;
}

export default function DeveloperDashboard() {
	const [activeProjects, setActiveProjects] = useState<Project[]>([]);
	const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		checkDeveloperAccess();
		loadProjects();
	}, []);

	const checkDeveloperAccess = async () => {
		const {
			data: { session },
		} = await supabaseClient.auth.getSession();
		if (!session) {
			router.push('/login');
			return;
		}

		const { data: profile } = await supabaseClient
			.from('profiles')
			.select('role')
			.eq('id', session.user.id)
			.single();

		if (!profile || (profile.role !== 'developer' && profile.role !== 'admin')) {
			router.push('/');
			toast({
				title: 'Access Denied',
				description: 'You do not have permission to access this page.',
				variant: 'destructive',
			});
		}
	};

	const loadProjects = async () => {
		try {
			const {
				data: { session },
			} = await supabaseClient.auth.getSession();
			if (!session) return;

			const { data: projectMembers, error: memberError } = await supabaseClient
				.from('project_members')
				.select('project_id')
				.eq('user_id', session.user.id)
				.eq('role', 'developer');

			if (memberError) throw memberError;

			const projectIds = projectMembers?.map((pm) => pm.project_id) || [];

			if (projectIds.length > 0) {
				const { data: projects, error: projectsError } = await supabaseClient
					.from('projects')
					.select('*')
					.in('id', projectIds)
					.order('updated_at', { ascending: false });

				if (projectsError) throw projectsError;

				const formattedProjects =
					projects?.map((project) => ({
						id: project.id,
						name: project.name,
						description: project.description || '',
						status: project.status,
						updated_at: project.updated_at,
					})) || [];

				setActiveProjects(formattedProjects.filter((p: Project) => p.status !== 'completed'));
				setCompletedProjects(formattedProjects.filter((p: Project) => p.status === 'completed'));
			}
		} catch (error) {
			console.error('Error loading projects:', error);
			toast({
				title: 'Error',
				description: 'Failed to load projects.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		const statusColors: Record<string, string> = {
			planning: 'bg-blue-500/10 text-blue-500',
			in_progress: 'bg-yellow-500/10 text-yellow-500',
			review: 'bg-purple-500/10 text-purple-500',
			completed: 'bg-green-500/10 text-green-500',
			on_hold: 'bg-red-500/10 text-red-500',
		};
		return statusColors[status] || 'bg-gray-500/10 text-gray-500';
	};

	if (loading) {
		return (
			<div className="container py-8">
				<h1 className="text-3xl font-bold mb-8">Developer Dashboard</h1>
				<div className="grid gap-6">
					{[1, 2, 3].map((i) => (
						<ProjectCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Developer Dashboard</h1>

			<Tabs defaultValue="active" className="space-y-6">
				<TabsList>
					<TabsTrigger value="active">Active Projects</TabsTrigger>
					<TabsTrigger value="completed">Completed Projects</TabsTrigger>
				</TabsList>

				<TabsContent value="active" className="space-y-6">
					{activeProjects.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-muted-foreground">
								No active projects found.
							</CardContent>
						</Card>
					) : (
						activeProjects.map((project) => (
							<Link key={project.id} href={`/projects/${project.id}`}>
								<Card className="transition-all hover:shadow-lg hover:border-primary/50">
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>{project.name}</CardTitle>
											<Badge className={getStatusColor(project.status)}>
												{project.status.replace('_', ' ')}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">{project.description}</p>
										<p className="text-sm text-muted-foreground">
											Last updated{' '}
											{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
										</p>
									</CardContent>
								</Card>
							</Link>
						))
					)}
				</TabsContent>

				<TabsContent value="completed" className="space-y-6">
					{completedProjects.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-muted-foreground">
								No completed projects found.
							</CardContent>
						</Card>
					) : (
						completedProjects.map((project) => (
							<Link key={project.id} href={`/projects/${project.id}`}>
								<Card className="transition-all hover:shadow-lg hover:border-primary/50">
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>{project.name}</CardTitle>
											<Badge className={getStatusColor(project.status)}>
												{project.status.replace('_', ' ')}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">{project.description}</p>
										<p className="text-sm text-muted-foreground">
											Last updated{' '}
											{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
										</p>
									</CardContent>
								</Card>
							</Link>
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
