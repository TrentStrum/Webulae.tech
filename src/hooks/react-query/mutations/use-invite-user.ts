import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { UseMutationResult } from '@tanstack/react-query';

export const useInviteUser = (): UseMutationResult<unknown, unknown, { email: string; role: string }, unknown> => useMutation({
	mutationFn: (data: { email: string; role: string }) => 
		apiClient.post('/users/invite', data),
}); 