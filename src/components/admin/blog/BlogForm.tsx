'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from '@/src/hooks/react-query/blog';

import { EnhancedRichTextEditor } from '../../editor/enhanced-rich-text-editor';

import type { BlogPostFormData } from '@/src/types/blog.types';


interface BlogFormProps {
	action: 'create' | 'edit';
	postId?: string;
}

export function BlogForm({ action, postId }: BlogFormProps): JSX.Element {
	const router = useRouter();
	const { toast } = useToast();
	const { register, handleSubmit, setValue, watch } = useForm<BlogPostFormData>({
		defaultValues: {
			title: '',
			content: '',
		},
	});

	const content = watch('content');

	// Queries and Mutations
	const { data: blogPost, isPending: isFetchingPost } = useBlogPost(postId || '');
	const createBlogPost = useCreateBlogPost();
	const updateBlogPost = useUpdateBlogPost(postId || '');

	// Prefill form when editing
	useEffect(() => {
		if (action === 'edit' && blogPost) {
			setValue('title', blogPost.title);
			setValue('content', blogPost.content || '');
		}
	}, [action, blogPost, setValue]);

	const onSubmit = async (data: BlogPostFormData) => {
		try {
			if (action === 'create') {
				await createBlogPost.mutateAsync(data);
				toast({
					title: 'Post Created',
					description: 'The blog post was created successfully.',
				});
			} else if (action === 'edit' && postId) {
				await updateBlogPost.mutateAsync(data);
				toast({
					title: 'Changes Saved',
					description: 'The blog post was updated successfully.',
				});
			}
			router.push('/admin/blog');
		} catch (error: unknown) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to save the blog post.',
				variant: 'destructive',
			});
		}
	};

	if (isFetchingPost && action === 'edit') {
		return <p>Loading post...</p>;
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="space-y-2">
				<label htmlFor="title">Title</label>
				<Input id="title" {...register('title')} required />
			</div>
			<div className="space-y-2">
				<label htmlFor="content">Content</label>
				<EnhancedRichTextEditor
					content={action === 'edit' ? blogPost?.content || '' : content}
					onChange={(value) => setValue('content', value)}
					placeholder="Write your blog content here..."
				/>
			</div>
			<Button type="submit" disabled={createBlogPost.isPending || updateBlogPost.isPending}>
				{createBlogPost.isPending || updateBlogPost.isPending
					? 'Saving...'
					: action === 'create'
						? 'Create'
						: 'Save Changes'}
			</Button>
		</form>
	);
}
