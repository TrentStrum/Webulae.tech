'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCreateProject } from '@/src/hooks/react-query/useProjects/useCreateProject';

import { ProjectForm } from '../components/ProjectForm';

import type { ProjectFormData } from '@/src/schemas/projectSchema';

export default function NewProjectPage() {
	const { mutate: createProjectMutation, isPending } = useCreateProject();
	const { user, isPending: authLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!authLoading && (!user || user.role !== 'admin')) {
			router.push('/');
		}
	}, [user, authLoading, router]);

	if (authLoading) {
		return null;
	}

	if (!user || user.role !== 'admin') {
		return null;
	}

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
