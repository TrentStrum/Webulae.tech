import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiError, ApiResponse } from '@/src/types/api.types';
import type { BlogPost } from '@/src/types/blog.types';

interface BlogResponseData {
	featured: BlogPost | null;
	categories: Record<string, BlogPost[]>;
}

export function useBlogPosts(params?: {
	searchTerm?: string;
	sortBy?: 'newest' | 'oldest';
	page?: number;
}): UseQueryResult<ApiResponse<BlogResponseData>, ApiError> {
	const queryString = params 
		? `?${new URLSearchParams(params as Record<string, string>).toString()}`
		: '';

	return useApiQuery<BlogResponseData>(
		[queryKeys.blog.all, params],
		`${endpoints.blog.base}${queryString}`,
		{ enabled: true }
	);
}

export function useBlogPost(postId: string): UseQueryResult<ApiResponse<BlogPost>, ApiError> {
	return useApiQuery<BlogPost>(
		queryKeys.blog.detail(postId),
		endpoints.blog.detail(postId),
		{ enabled: !!postId }
	);
} 