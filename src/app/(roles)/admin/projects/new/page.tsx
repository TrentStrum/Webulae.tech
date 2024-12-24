'use client';

import { useUser } from '@clerk/nextjs';

import { ProjectForm } from '@/src/components/projects/ProjectForm';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCreateProject } from '@/src/hooks/react-query/projects/mutations';

import type { ProjectFormData } from '@/src/schemas/projectSchema';


export default function NewProjectPage() {
	const { user } = useUser();
	const { mutate: createProjectMutation, isPending } = useCreateProject();


	const createProject = async (formData: ProjectFormData): Promise<void> => {
		await createProjectMutation({
			...formData,
			projectId: crypto.randomUUID(),
			userId: user?.id || '',
			dev_environment_url: formData.dev_environment_url || null,
			staging_environment_url: formData.staging_environment_url || null,
			start_date: formData.start_date || null,
			target_completion_date: formData.target_completion_date || null,
		});
	};

	return (
		<div className="container max-w-3xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Create New Project</CardTitle>
				</CardHeader>
				<ProjectForm onSubmit={createProject} isSubmitting={isPending} />
			</Card>
		</div>
	);
}
