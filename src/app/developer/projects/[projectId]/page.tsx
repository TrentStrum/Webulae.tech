'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectDetails } from '@/src/hooks/react-query/useProjects/useProjectDetails';
import { Card, CardHeader, CardContent, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';

export default function ProjectDashboard() {
	const { id } = useParams();
	const projectId = Array.isArray(id) ? id[0] : id;
	const { data: project, isLoading, isError } = useProjectDetails(projectId);

	if (isLoading) {
		return <div className="container py-8">Loading...</div>;
	}

	if (isError) {
		return <div className="container py-8">Error loading project details</div>;
	}

	if (!project) {
		return <div className="container py-8">Project not found</div>;
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>{project.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground mb-4">{project.description}</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<Badge className="bg-blue-500/10 text-blue-500">{project.status}</Badge>
						<p>
							Start Date:{' '}
							{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
						</p>
						<p>
							Target Completion:{' '}
							{project.target_completion_date
								? new Date(project.target_completion_date).toLocaleDateString()
								: 'N/A'}
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 sm:grid-cols-2">
				<Link href={`/projects/${projectId}/messages`}>
					<Button variant="outline" className="w-full">
						View Messages
					</Button>
				</Link>
				<Link href={`/projects/${projectId}/timeline`}>
					<Button variant="outline" className="w-full">
						View Timeline
					</Button>
				</Link>
				<Link href={`/projects/${projectId}/scope-change`}>
					<Button variant="outline" className="w-full">
						Request Scope Change
					</Button>
				</Link>
			</div>
		</div>
	);
}
