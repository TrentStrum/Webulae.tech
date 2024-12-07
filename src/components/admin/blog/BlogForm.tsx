'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { EnhancedRichTextEditor } from '@/src/components/editor/enhanced-rich-text-editor';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useToast } from '@/src/hooks/helpers/use-toast';
import {
	useAdminBlogPost,
	useCreateBlogPost,
	useUpdateBlogPost,
} from '@/src/hooks/react-query/useBlog';

import type { BlogPostFormData } from '@/src/types/blog.types';

interface BlogFormProps {
	action: 'create' | 'edit';
	postId?: string; // Required for editing
}

export function BlogForm({ action, postId }: BlogFormProps) {
	const router = useRouter();
	const { register, handleSubmit, setValue, watch } = useForm<BlogPostFormData>({
		defaultValues: {
			title: '',
			content: '',
		},
	});
	const { toast } = useToast();
	const content = watch('content'); // Watch the `content` field for changes

	// Fetch the blog post when editing
	const { data: blogPost, isPending: isFetchingPost } = useAdminBlogPost(
		postId || '',
		action === 'edit'
	);

	// Prefill the form when editing
	useEffect(() => {
		if (action === 'edit' && blogPost) {
			setValue('title', blogPost.title);
			setValue('content', blogPost.content || '');
		}
	}, [action, blogPost, setValue]);

	// Hook for creating a new blog post
	const createBlogPost = useCreateBlogPost();
	console.log('createBlogPost mutation state:', {
		isPending: createBlogPost.isPending,
		isError: createBlogPost.isError,
	});

	// Hook for updating an existing blog post
	const updateBlogPost = useUpdateBlogPost(postId || '');
	console.log('updateBlogPost mutation state:', {
		isPending: updateBlogPost.isPending,
		isError: updateBlogPost.isError,
	});

	const onSubmit = (data: BlogPostFormData) => {
		console.log('Starting onSubmit with action:', action); // Debug log

		if (action === 'create') {
			console.log('Triggering create mutation');
			createBlogPost.mutate(data, {
				onSuccess: () => {
					console.log('Create successful');
					toast({
						title: 'Post Created',
						description: 'The blog post was created successfully.',
					});
					router.push('/admin/blog');
				},
				onError: (error: any) => {
					console.error('Create error:', error);
					toast({
						title: 'Error',
						description: error.message || 'Failed to create the blog post.',
						variant: 'destructive',
					});
				},
			});
		} else if (action === 'edit' && postId) {
			console.log('Triggering update mutation for postId:', postId);
			updateBlogPost.mutate(data, {
				onSuccess: () => {
					console.log('Update successful');
					toast({
						title: 'Changes Saved',
						description: 'The blog post was updated successfully.',
					});
					router.push('/admin/blog');
				},
				onError: (error: any) => {
					console.error('Update error details:', {
						error,
						message: error.message,
						response: error.response,
					});
					toast({
						title: 'Error',
						description: error.message || 'Failed to update the blog post.',
						variant: 'destructive',
					});
				},
			});
		}
	};

	if (isFetchingPost && action === 'edit') return <p>Loading post...</p>;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				console.log('Form handleSubmit triggered with data:', data); // Debug log
				try {
					onSubmit(data);
				} catch (error) {
					console.error('Error in onSubmit:', error); // Debug log
				}
			})}
			className="space-y-6"
		>
			<div className="space-y-2">
				<label htmlFor="title">Title</label>
				<Input id="title" {...register('title')} required />
			</div>
			<div className="space-y-2">
				<label htmlFor="content">Content</label>
				<EnhancedRichTextEditor
					content={action === 'edit' ? blogPost?.content || '' : content || ''}
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
