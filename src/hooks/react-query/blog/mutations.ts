import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryClient } from '@/src/config/query-client';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { BlogPost } from '@/src/types/blog.types';

export function useCreateBlogPost(): UseMutationResult<
	ApiResponse<BlogPost>,
	ApiError,
	Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
> {
	return useApiMutation<BlogPost, Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>(
		endpoints.blog.base,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.blog.all
				});
			}
		}
	);
}

export function useUpdateBlogPost(): UseMutationResult<
	ApiResponse<BlogPost>,
	ApiError,
	{ id: string; data: Partial<BlogPost> }
> {
	return useApiMutation<BlogPost, { id: string; data: Partial<BlogPost> }>(
		endpoints.blog.base,
		{
			mutationFn: async ({ id, data }) => {
				const response = await apiClient.patch<ApiResponse<BlogPost>>(
					endpoints.blog.detail(id),
					data
				);
				return response.data;
			},
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.blog.detail(variables.id)
				});
				queryClient.invalidateQueries({
					queryKey: queryKeys.blog.all
				});
			}
		}
	);
} 