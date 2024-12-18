import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { ScopeChangeRequest } from '@/src/types/scopeChange.types';
import type { UseMutationResult } from '@tanstack/react-query';

export const useCreateScopeChangeRequest = (
	projectId: string
): UseMutationResult<ScopeChangeRequest, Error, Omit<ScopeChangeRequest, 'id'>> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (request: Omit<ScopeChangeRequest, 'id'>) => {
			const response = await apiClient.post<Omit<ScopeChangeRequest, 'id'>, ScopeChangeRequest>(
				`/projects/${projectId}/scope-change-requests`,
				request
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['scopeChangeRequests', projectId] });
		},
	});
};
