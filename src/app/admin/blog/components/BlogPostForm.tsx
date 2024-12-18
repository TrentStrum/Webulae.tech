'use client';

import { EnhancedRichTextEditor } from '@/src/components/editor/enhanced-rich-text-editor';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

import type { BlogPost, BlogPostFormData } from '@/src/types/blog.types';

interface BlogPostFormProps {
	mode: 'create' | 'edit';
	initialData?: BlogPost;
	onSubmit: (data: BlogPostFormData) => Promise<void>;
	isLoading: boolean;
}

export function BlogPostForm({ mode, initialData, onSubmit, isLoading }: BlogPostFormProps) {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		await onSubmit({
			title: formData.get('title') as string,
			content: formData.get('content') as string,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-6">
			<Input
				name="title"
				defaultValue={initialData?.title || ''}
				placeholder="Post Title"
				required
			/>
			<EnhancedRichTextEditor
				content={initialData?.content || ''}
				onChange={(content) => {
					const contentInput = document.querySelector('input[name="content"]');
					if (contentInput) (contentInput as HTMLInputElement).value = content;
				}}
			/>
			<input type="hidden" name="content" value={initialData?.content || ''} />
			<Button type="submit" disabled={isLoading}>
				{isLoading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
			</Button>
		</form>
	);
}
