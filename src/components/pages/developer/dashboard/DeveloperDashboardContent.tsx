'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { ProjectCardSkeleton } from '@/src/components/skeletons/project-card-skeleton';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useProjects } from '@/src/hooks';

import type { Project } from '@/src/types';

export default function DeveloperDashboardContent() {
	const { data: projects, isLoading } = useProjects();

	if (isLoading) {
		return <ProjectCardSkeleton />;
	}

	const activeProjects = projects?.filter((p) => p.status !== 'completed') ?? [];
	const completedProjects = projects?.filter((p) => p.status === 'completed') ?? [];

	return (
		<div className="container py-8">
			<Tabs defaultValue="active" className="space-y-6">
				<TabsList>
					<TabsTrigger value="active">Active Projects</TabsTrigger>
					<TabsTrigger value="completed">Completed Projects</TabsTrigger>
				</TabsList>

				<TabsContent value="active">
					{activeProjects.map((project) => (
						<ProjectCard key={project.projectId} project={project} />
					))}
				</TabsContent>

				<TabsContent value="completed">
					{completedProjects.map((project) => (
						<ProjectCard key={project.projectId} project={project} />
					))}
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ProjectCard({ project }: { project: Project }) {
	return (
		<Link href={`/projects/${project.projectId}`}>
			<Card>
				<CardHeader>
					<CardTitle>{project.name}</CardTitle>
					<Badge>{project.status}</Badge>
				</CardHeader>
				<CardContent>
					<p>{project.description}</p>
					<p className="text-sm text-muted-foreground">
						Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
