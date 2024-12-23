import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';

import type { BlogPost, BlogPostFormData, BlogResponse } from '@/src/types/blog.types';
import type { UseMutationResult, UseQueryResult, UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

export function useBlogPost(id: string): UseQueryResult<BlogPost, Error> {
	return useQuery({
		queryKey: ['blog-post', id],
		queryFn: async () => {
			// Fetch blog post logic
			return {} as BlogPost;
		},
		enabled: !!id
	});
}

export function useCreateBlogPost(): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	return useMutation({
		mutationFn: async (data: BlogPostFormData) => {
			const response = await fetch('/api/blog', {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response.json();
		}
	});
}

export function useUpdateBlogPost(id: string): UseMutationResult<BlogPost, Error, BlogPostFormData> {
	return useMutation({
			mutationFn: async (data: BlogPostFormData) => {
				// Update blog post logic using id
				const response = await fetch(`/api/blog/${id}`, {
					method: 'PUT',
					body: JSON.stringify(data)
				});
				return response.json();
			}
	});
}

export function useBlogPosts(params: { searchTerm?: string; sortBy?: string } = {}): UseInfiniteQueryResult<InfiniteData<BlogResponse>, Error> {
	return useInfiniteQuery({
		queryKey: ['blog-posts', params],
		queryFn: async ({ pageParam = 0 }) => {
			const response = await fetch(`/api/blog?page=${pageParam}&search=${params.searchTerm || ''}&sort=${params.sortBy || ''}`);
			return response.json();
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextCursor
	});
}

export function useBlogPostWithViews(slug: string): UseQueryResult<BlogPost & { views: number }, Error> {
	return useQuery({
		queryKey: ['blog-post', slug, 'with-views'],
		queryFn: async () => {
			const response = await fetch(`/api/blog/${slug}?include=views`);
			return response.json();
		},
		enabled: !!slug
	});
}
