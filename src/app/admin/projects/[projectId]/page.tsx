'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useProject, useDeleteProject } from '@/src/hooks/react-query/useProjects';

export default function ProjectDetailsPage() {
	const { projectId } = useParams();
	const router = useRouter();
	const { toast } = useToast();
	const { data: project, isLoading } = useProject(projectId as string);
	const deleteProject = useDeleteProject();

	const handleDelete = async () => {
		try {
			await deleteProject.mutateAsync(projectId as string);
			toast({
				title: 'Success',
				description: 'Project deleted successfully',
			});
			router.push('/admin/projects');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete project',
				variant: 'destructive',
			});
		}
	};

	const handleEdit = () => {
		router.push(`/admin/projects/${projectId}/edit`);
	};

	if (isLoading) {
		return (
			<div className="container py-8 flex justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (!project) {
		return (
			<div className="container py-8">
				<Card>
					<CardContent className="py-8 text-center">Project not found</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>{project.name}</CardTitle>
					<div className="flex gap-4">
						<Button onClick={handleEdit}>Edit Project</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={deleteProject.isPending}>
							{deleteProject.isPending ? 'Deleting...' : 'Delete Project'}
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h3 className="text-lg font-medium mb-2">Description</h3>
						<p className="text-muted-foreground">
							{project.description || 'No description provided'}
						</p>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-2">Status</h3>
						<p className="capitalize">{project.status}</p>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-2">Environments</h3>
						<div className="space-y-2">
							{project.dev_environment_url && (
								<p>
									<span className="font-medium">Development:</span>{' '}
									<a
										href={project.dev_environment_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline"
									>
										{project.dev_environment_url}
									</a>
								</p>
							)}
							{project.staging_environment_url && (
								<p>
									<span className="font-medium">Staging:</span>{' '}
									<a
										href={project.staging_environment_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline"
									>
										{project.staging_environment_url}
									</a>
								</p>
							)}
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-2">Timeline</h3>
						<div className="space-y-2">
							{project.start_date && (
								<p>
									<span className="font-medium">Start Date:</span>{' '}
									{new Date(project.start_date).toLocaleDateString()}
								</p>
							)}
							{project.target_completion_date && (
								<p>
									<span className="font-medium">Target Completion:</span>{' '}
									{new Date(project.target_completion_date).toLocaleDateString()}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
