'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

interface Project {
	id: string;
	name: string;
	description: string;
	status: string;
}

export default function ProjectsPage() {
	const {
		data: projects,
		isLoading,
		isError,
	} = useQuery<Project[]>({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await apiClient.get<{ data: Project[] }>('/projects');
			return response.data;
		},
	});

	if (isLoading) {
		return <div className="container py-8">Loading projects...</div>;
	}

	if (isError) {
		return <div className="container py-8">Failed to load projects.</div>;
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Projects</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{projects?.map((project) => (
					<Card key={project.id}>
						<CardHeader>
							<CardTitle>{project.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">{project.description}</p>
							<p className="text-sm font-semibold capitalize">Status: {project.status}</p>
							<Link href={`/projects/${project.id}`}>
								<Button variant="outline" className="mt-4">
									View Project
								</Button>
							</Link>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
