'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useProjects } from '@/src/hooks';

export default function AdminProjectsPage(): JSX.Element {
	const { data: projects, isPending, isError } = useProjects();

	if (isPending) {
		return <div className="container py-8">Loading projects...</div>;
	}

	if (isError) {
		return <div className="container py-8">Failed to load projects.</div>;
	}

	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Projects</h1>
				<Link href="/admin/projects/new">
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						New Project
					</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{projects?.data.map((project) => (
					<Card key={project.projectId}>
						<CardHeader>
							<CardTitle>{project.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">{project.description}</p>
							<p className="text-sm font-semibold capitalize">Status: {project.status}</p>
							<div className="flex gap-2 mt-4">
								<Link href={`/admin/projects/${project.projectId}`}>
									<Button variant="outline">View</Button>
								</Link>
								<Link href={`/admin/projects/${project.projectId}/edit`}>
									<Button variant="outline">Edit</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
} 