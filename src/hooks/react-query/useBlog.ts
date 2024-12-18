'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { BlogPost, BlogPostFormData } from '@/src/types/blog.types';
import type {
	UseInfiniteQueryResult,
	UseQueryResult,
	UseMutationResult,
	UseMutationOptions
} from '@tanstack/react-query';

interface BlogResponse {
	posts: BlogPost[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
}

interface UseBlogPostsParams {
	searchTerm?: string;
	sortBy?: string;
}

export function useBlogPosts({ searchTerm = '', sortBy = 'newest' }: UseBlogPostsParams): UseInfiniteQueryResult<BlogResponse, Error> {
	return useInfiniteQuery<BlogResponse>({
		queryKey: ['blog-posts', searchTerm, sortBy],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await apiClient.get<BlogResponse>(
				`/api/blog?page=${pageParam}&searchTerm=${searchTerm}&sortBy=${sortBy}`
			);
			return response;
		},
		getNextPageParam: (lastPage) => {
			if (!lastPage.pagination.hasMore) return undefined;
			return lastPage.pagination.page + 1;
		},
		initialPageSize: 10,
	});
}

export function useBlogPost(slug: string): UseQueryResult<BlogPost, Error> {
	return useQuery({
		queryKey: ['blog', 'post', slug],
		queryFn: async () => {
			const response = await apiClient.get<BlogPost>(`/api/blog/${slug}`);
			if (!response) {
				throw new Error('Blog post not found');
			}
			return response;
		},
		enabled: !!slug,
		retry: false,
		staleTime: 1000 * 60 * 5,
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
