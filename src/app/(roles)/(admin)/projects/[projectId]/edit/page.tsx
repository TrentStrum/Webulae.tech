'use client';

import { useParams, useRouter } from 'next/navigation';

import { ProjectForm } from '@/src/components/projects/ProjectForm';
import { useProjectDetails, useUpdateProject } from '@/src/hooks';


type ProjectFormData = {
	name: string;
	description: string;
	status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
	dev_environment_url?: string;
	staging_environment_url?: string;
	start_date?: string;
	target_completion_date?: string;
};

export default function EditProjectPage(): JSX.Element {
	const router = useRouter();
	const { projectId } = useParams();
	const { isLoading } = useProjectDetails(projectId as string);
	const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

	if (isLoading) {
		return <div className="container py-8">Loading project...</div>;
	}

	const handleSubmit = async (formData: ProjectFormData): Promise<void> => {
		await updateProject(
			{ id: projectId as string, data: formData },
			{
				onSuccess: () => {
					router.push('/admin/projects');
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
