'use client';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';

import type { ProjectFormData } from '@/src/schemas/projectSchema';

interface ProjectFormProps {
	onSubmit: (data: ProjectFormData) => void;
	isSubmitting: boolean;
}

export function ProjectForm({ onSubmit, isSubmitting }: ProjectFormProps): JSX.Element {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		onSubmit({
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			status: 'planning',
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-6">
			<div>
				<Input name="name" placeholder="Project Name" required />
			</div>
			<div>
				<Textarea name="description" placeholder="Description" required />
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Creating...' : 'Create Project'}
			</Button>
		</form>
	);
}
