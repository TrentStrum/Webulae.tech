'use client';

import {
	useMutation,
	type UseMutationOptions,
	type UseMutationResult,
} from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

export function useDeleteProject(
	options?: UseMutationOptions<void, Error, string>
): UseMutationResult<void, Error, string> {
	return useMutation({
		mutationFn: async (projectId: string): Promise<void> => {
			await apiClient.delete(`/api/admin/projects/${projectId}`);
		},
		...options,
	});
}
