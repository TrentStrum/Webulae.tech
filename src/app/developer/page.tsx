'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { ProjectCardSkeleton } from '@/src/components/skeletons/project-card-skeleton';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useDeveloperProjects } from '@/src/hooks/react-query/useProjects/useDeveloperProjects';
import { getStatusColor } from '@/src/utils/statusColors';

export default function DeveloperDashboard() {
	// Fetch projects
	const { data: activeProjects, isLoading: isLoadingActiveProjects } = useDeveloperProjects();
	const { data: completedProjects, isLoading: isLoadingCompletedProjects } = useDeveloperProjects();

	if (isLoadingActiveProjects || isLoadingCompletedProjects) {
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
					{activeProjects?.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-muted-foreground">
								No active projects found.
							</CardContent>
						</Card>
					) : (
						activeProjects?.map((project) => (
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
					{completedProjects?.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-muted-foreground">
								No completed projects found.
							</CardContent>
						</Card>
					) : (
						completedProjects?.map((project) => (
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
