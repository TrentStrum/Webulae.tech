import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { ScopeChangeRequest } from '@/src/types/scopeChange.types';

export const useCreateScopeChangeRequest = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (request: Omit<ScopeChangeRequest, 'id'>) => {
			const response = await apiClient.post<Omit<ScopeChangeRequest, 'id'>, ScopeChangeRequest>(
				`/projects/${projectId}/scope-change-requests`,
				request,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['scopeChangeRequests', projectId] });
		},
	});
};
