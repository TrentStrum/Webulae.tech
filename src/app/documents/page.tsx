'use client';

import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useToast } from '@/src/hooks';
import { ProjectFormData } from '@/src/schemas/projectSchema';
import { useRouter } from 'next/navigation';
import ProjectForm from '../projects/components/ProjectForm';
import { createProjectHooks } from '@/src/hooks/react-query/useProjects';
import { SupabaseProjectDataAccess } from '@/src/dataAccess/supabaseProjectDataAccess';

export default function NewProjectPage() {
	const { mutateAsync: createProject, isPending } = createProjectHooks(new SupabaseProjectDataAccess()).useCreateProject();
	const router = useRouter();
	const { toast } = useToast();

	const handleSubmit = async (data: ProjectFormData) => {
		try {
			await createProject(data);

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
