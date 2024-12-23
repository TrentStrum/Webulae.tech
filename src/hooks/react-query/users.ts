import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { PaginatedResponse, User } from '@/src/types/user.types';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export const useUsers = (): UseQueryResult<PaginatedResponse<User>> => useQuery({
	queryKey: ['users'],
	queryFn: () => apiClient.get('/users'),
});

export const useInviteUser = (): UseMutationResult<unknown, unknown, { email: string; role: string }, unknown> => useMutation({
	mutationFn: (data: { email: string; role: string }) => 
		apiClient.post('/users/invite', data),
});