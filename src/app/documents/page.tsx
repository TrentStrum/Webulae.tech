'use client';

import { useRouter } from 'next/navigation';

import { ProjectForm } from '@/src/components/forms/project-form';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useCreateProject } from '@/src/hooks/react-query/useProjects/useCreateProject';

import type { ProjectFormData } from '@/src/schemas/projectSchema';

export default function NewProjectPage() {
	const { mutateAsync: createProjectMutation, isPending } = useCreateProject();
	const router = useRouter();
	const { toast } = useToast();

	const handleSubmit = async (data: ProjectFormData) => {
		try {
			await createProjectMutation({
				...data,
				dev_environment_url: data.dev_environment_url || null,
				staging_environment_url: data.staging_environment_url || null,
				start_date: data.start_date || null,
				target_completion_date: data.target_completion_date || null,
				projectId: '',
				userId: '',
			});

			toast({
				title: 'Success',
				description: 'Project created successfully.',
			});

			router.push('/admin/projects');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create project.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="container max-w-3xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Create New Project</CardTitle>
				</CardHeader>
				<ProjectForm onSubmit={handleSubmit} isSubmitting={isPending} />
			</Card>
		</div>
	);
}
