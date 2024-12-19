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

export interface BlogPageData {
	featured?: BlogPost;
	categories: {
		[key: string]: BlogPost[];
	};
}

export interface BlogResponse {
	data: BlogPageData;
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

export function useBlogPosts({ 
	searchTerm = '', 
	sortBy = 'newest' 
}: UseBlogPostsParams): UseInfiniteQueryResult<InfiniteData<BlogResponse>, Error> {
	return useInfiniteQuery<BlogResponse, Error>({
		queryKey: ['blog-posts', searchTerm, sortBy],
		queryFn: async ({ pageParam = 1 }) => {
			try {
				console.log('Fetching page:', pageParam, 'with params:', { searchTerm, sortBy });
				const { data } = await apiClient.get<BlogResponse>(
					`/api/blog/posts?page=${pageParam}&searchTerm=${searchTerm}&sortBy=${sortBy}&includeCategories=true`
				);
				console.log('API Response:', data);
				if (!data) throw new Error('No data returned from API');
				return data;
			} catch (error) {
				console.error('Query Error:', error);
				throw error;
			}
		},
		getNextPageParam: (lastPage) => {
			console.log('Last page pagination:', lastPage.pagination);
			if (!lastPage.pagination.hasMore) return undefined;
			return lastPage.pagination.page + 1;
		},
		initialPageParam: 1,
	});
}

export function useBlogPost(slug: string): UseQueryResult<BlogPost> {
	return useQuery({
		queryKey: ['blog-post', slug],
		queryFn: async () => {
			const { data } = await apiClient.get<BlogPost>(`/api/blog/${slug}`);
			if (!data) throw new Error('Blog post not found');
			return data;
		},
		enabled: !!slug,
	});
}

export function useCreateBlogPost(): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BlogPostFormData) => {
			const { data: response } = await apiClient.post<BlogPost>('/api/blog', data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
		},
	});
}

export function useUpdateBlogPost(postId: string): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: BlogPostFormData) => {
			const { data: response } = await apiClient.put<BlogPost>(`/api/blog/${postId}`, data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
		},
	});
}

export function useDeleteBlogPost(
	options?: UseMutationOptions<void, Error, string>
): UseMutationResult<void, Error, string> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string): Promise<void> => {
			await apiClient.delete(`/api/blog/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
		},
		...options,
	});
}
