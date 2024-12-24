'use client';

import Link from 'next/link';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useProjects } from '@/src/hooks';

export default function DeveloperProjectsPage(): JSX.Element {
	const { data, isLoading } = useProjects();

	if (isLoading) {
		return <div className="container py-8">Loading projects...</div>;
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">My Projects</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{data?.data?.map((project) => (
					<Card key={project.projectId}>
						<CardHeader>
							<CardTitle>{project.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">{project.description}</p>
							<p className="text-sm font-semibold capitalize">Status: {project.status}</p>
							<div className="flex gap-2 mt-4">
								<Link href={`/developer/projects/${project.projectId}`}>
									<Button variant="outline">View Details</Button>
								</Link>
								<Link href={`/developer/projects/${project.projectId}/messages`}>
									<Button variant="outline">Messages</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
} 