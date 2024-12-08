'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ProjectCardSkeleton } from '@/src/components/skeletons/project-card-skeleton';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useProjects, useToast } from '@/src/hooks';
import { useProfile } from '@/src/hooks/react-query/useProfile';

import type { Project } from '@/src/types';

export default function DeveloperDashboard(): JSX.Element {
	const router = useRouter();
	const { toast } = useToast();

	// Get user profile and check access
	const { profile, isLoading: isLoadingProfile } = useProfile();
	if (!profile || (profile.role !== 'developer' && profile.role !== 'admin')) {
		router.push('/');
		toast({
			title: 'Access Denied',
			description: 'You do not have permission to access this page.',
			variant: 'destructive',
		});
	}

	// Fetch projects
	const { data: projects, isLoading: isLoadingProjects } = useProjects();

	const activeProjects = projects?.filter((p) => p.status !== 'completed') ?? [];
	const completedProjects = projects?.filter((p) => p.status === 'completed') ?? [];

	const getStatusColor = (status: Project['status']): string => {
		const statusColors: Record<string, string> = {
			planning: 'bg-blue-500/10 text-blue-500',
			in_progress: 'bg-yellow-500/10 text-yellow-500',
			review: 'bg-purple-500/10 text-purple-500',
			completed: 'bg-green-500/10 text-green-500',
			on_hold: 'bg-red-500/10 text-red-500',
		};
		return statusColors[status] || 'bg-gray-500/10 text-gray-500';
	};

	if (isLoadingProfile || isLoadingProjects) {
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
							<Link key={project.projectId} href={`/projects/${project.projectId}`}>
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
							<Link key={project.projectId} href={`/projects/${project.projectId}`}>
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
