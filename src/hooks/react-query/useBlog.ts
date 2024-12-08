'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { BlogPost, BlogPostFormData } from '@/src/types/blog.types';
import type {
	UseInfiniteQueryResult,
	UseQueryResult,
	UseMutationResult,
	UseMutationOptions,
} from '@tanstack/react-query';

interface UseBlogPostsParams {
	searchTerm?: string;
	sortBy?: string;
}

export function useBlogPosts({
	searchTerm,
	sortBy,
}: UseBlogPostsParams): UseInfiniteQueryResult<BlogPost[], Error> {
	return useInfiniteQuery({
		queryKey: ['blog-posts', searchTerm, sortBy],
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			const response = await apiClient.get<BlogPost[]>('/blog', {
				params: {
					page: pageParam,
					search: searchTerm,
					sort: sortBy,
				},
			});
			return response;
		},
		getNextPageParam: (lastPage, pages) => (lastPage.length > 0 ? pages.length : undefined),
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
			const response = await apiClient.put<BlogPost>(`/api/admin/blog/${postId}`, data);
			return response;
		},
	});
}

export function useDeleteBlogPost(
	options?: UseMutationOptions<void, Error, string>
): UseMutationResult<void, Error, string> {
	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiClient.delete(`/api/admin/blog/${id}`);
		},
		...options,
	});
}

export function useBlogPostWithViews(slug: string): UseQueryResult<BlogPost, Error> {
	return useQuery({
		queryKey: ['blog', 'post', slug],
		queryFn: async () => {
			const response = await apiClient.get<BlogPost>(`/api/blog/${slug}`);

			// Increment view count if post exists
			if (response?.id) {
				await apiClient.post('/api/blog/views', {
					post_id: response.id,
				});
			}

			return response;
		},
		enabled: !!slug,
	});
}
