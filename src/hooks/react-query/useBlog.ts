'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { BlogPost, BlogPostFormData } from '@/src/types/blog.types';
import type {
	UseInfiniteQueryResult,
	UseQueryResult,
	UseMutationResult,
	UseMutationOptions,
	InfiniteData,
} from '@tanstack/react-query';

interface UseBlogPostsParams {
	searchTerm?: string;
	sortBy?: string;
}

export function useBlogPosts({
	searchTerm,
	sortBy,
}: UseBlogPostsParams): UseInfiniteQueryResult<InfiniteData<BlogPost[]>, Error> {
	return useInfiniteQuery<BlogPost[]>({
		queryKey: ['blog-posts', searchTerm, sortBy],
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => {
			try {
				const posts = await apiClient.get<BlogPost[]>('/api/blog', {
					params: {
						page: pageParam,
						searchTerm,
						sortBy,
					},
				});
				return posts;
			} catch (error) {
				console.error('API Error:', error);
				throw error;
			}
		},
		getNextPageParam: (lastPage: BlogPost[], pages: BlogPost[][]) => {
			return lastPage?.length === 10 ? pages.length + 1 : undefined;
		},
	});
}

export function useBlogPost(slug: string): UseQueryResult<BlogPost, Error> {
	return useQuery({
		queryKey: ['blog', 'post', slug],
		queryFn: async () => {
			const response = await apiClient.get<BlogPost>(`/blog/${slug}`);
			return response;
		},
		enabled: !!slug,
	});
}

export function useCreateBlogPost(): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BlogPostFormData) => {
			const response = await apiClient.post<BlogPost>('/blog', data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
		},
	});
}

export function useUpdateBlogPost(
	postId: string
): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	return useMutation({
		mutationFn: async (data: BlogPostFormData) => {
			const response = await apiClient.put<BlogPost>(`/admin/blog/${postId}`, data);
			return response;
		},
	});
}

export function useDeleteBlogPost(
	options?: UseMutationOptions<void, Error, string>
): UseMutationResult<void, Error, string> {
	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiClient.delete(`/admin/blog/${id}`);
		},
		...options,
	});
}

export function useBlogPostWithViews(slug: string): UseQueryResult<BlogPost, Error> {
	return useQuery({
		queryKey: ['blog', 'post', slug],
		queryFn: async () => {
			const response = await apiClient.get<BlogPost>(`/blog/${slug}`);

			// Increment view count if post exists
			if (response?.id) {
				await apiClient.post('/blog/views', {
					post_id: response.id,
				});
			}

			return response;
		},
		enabled: !!slug,
	});
}
