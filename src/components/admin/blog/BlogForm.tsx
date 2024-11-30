'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { BlogPost } from '@/src/types/blog.types';

interface BlogFormProps {
	action: 'create' | 'edit';
	initialData?: BlogPost;
}

export function BlogForm({ action }: BlogFormProps) {
	const { register, handleSubmit } = useForm();

	const onSubmit = (data: any) => {
		console.log(`${action === 'create' ? 'Creating' : 'Editing'} blog post`, data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="space-y-2">
				<label htmlFor="title">Title</label>
				<Input id="title" {...register('title')} />
			</div>
			<div className="space-y-2">
				<label htmlFor="content">Content</label>
				<Textarea id="content" {...register('content')} />
			</div>
			<Button type="submit">{action === 'create' ? 'Create' : 'Save Changes'}</Button>
		</form>
	);
}
