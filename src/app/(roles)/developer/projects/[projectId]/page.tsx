'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useProjectDetails } from '@/src/hooks';

export default function DeveloperProjectDetailsPage(): JSX.Element {
	const { projectId } = useParams();
	const { data, isLoading } = useProjectDetails(projectId as string);

	if (isLoading) {
		return <div className="container py-8">Loading project details...</div>;
	}

	const project = data?.data;
	if (!project) {
		return <div className="container py-8">Project not found.</div>;
	}

	return (
		<div className="container py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Project Details</h1>
				<div className="flex gap-2">
					<Link href={`/developer/projects/${projectId}/messages`}>
						<Button variant="outline">Messages</Button>
					</Link>
					<Link href={`/developer/projects/${projectId}/documents`}>
						<Button variant="outline">Documents</Button>
					</Link>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{project.name}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="font-semibold mb-2">Description</h3>
						<p className="text-muted-foreground">{project.description}</p>
					</div>
					<div>
						<h3 className="font-semibold mb-2">Status</h3>
						<p className="capitalize">{project.status}</p>
					</div>
					{project.start_date && (
						<div>
							<h3 className="font-semibold mb-2">Start Date</h3>
							<p>{new Date(project.start_date).toLocaleDateString()}</p>
						</div>
					)}
					{project.target_completion_date && (
						<div>
							<h3 className="font-semibold mb-2">Target Completion Date</h3>
							<p>{new Date(project.target_completion_date).toLocaleDateString()}</p>
						</div>
					)}
					{project.dev_environment_url && (
						<div>
							<h3 className="font-semibold mb-2">Development Environment</h3>
							<Link href={project.dev_environment_url} target="_blank" className="text-primary hover:underline">
								{project.dev_environment_url}
							</Link>
						</div>
					)}
					{project.staging_environment_url && (
						<div>
							<h3 className="font-semibold mb-2">Staging Environment</h3>
							<Link href={project.staging_environment_url} target="_blank" className="text-primary hover:underline">
								{project.staging_environment_url}
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
