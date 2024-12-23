'use client';

import { useParams, useRouter } from 'next/navigation';

import { ProjectForm } from '@/src/components/projects/ProjectForm';
import { useProjectDetails, useUpdateProject } from '@/src/hooks';

import type { Project } from '@/src/types';

export default function ClientProjectEditPage(): JSX.Element {
	const router = useRouter();
	const { projectId } = useParams();
	const { data, isLoading } = useProjectDetails(projectId as string);
	const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

	if (isLoading) {
		return <div className="container py-8">Loading project...</div>;
	}

	const project = data?.data;
	if (!project) {
		return <div className="container py-8">Project not found.</div>;
	}

	const handleSubmit = async (formData: Partial<Project>): Promise<void> => {
		await updateProject(
			{ id: projectId as string, data: formData },
			{
				onSuccess: () => {
					router.push('/client/projects');
				},
			}
		);
	};
    
	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Edit Project</h1>
			<ProjectForm onSubmit={handleSubmit} isSubmitting={isUpdating} />
		</div>
	);
}
