import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { DatabaseProfile } from '@/src/types/database.types';
import type { BaseUser } from '@/src/types/user.types';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export const useUsers = (): UseQueryResult<DatabaseProfile[], Error> => {
	return useQuery<DatabaseProfile[], Error>({
		queryKey: ['users'],
		queryFn: () => apiClient.get<DatabaseProfile[]>('/api/users'),
	});
};

export const useToggleUserRole = (): UseMutationResult<
	void,
	Error,
	{ userId: string; currentRole: keyof typeof roles }
> => {
	const queryClient = useQueryClient();

	const roles = {
		client: 'developer',
		developer: 'admin',
		admin: 'client',
	} as const;

	return useMutation<void, Error, { userId: string; currentRole: keyof typeof roles }>({
		mutationFn: async ({ userId, currentRole }) => {
			const newRole = roles[currentRole] || 'client';
			await apiClient.patch(`/users/${userId}/role`, { role: newRole });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useCurrentUser = (): UseQueryResult<BaseUser, Error> => {
	return useQuery<BaseUser, Error>({
		queryKey: ['currentUser'],
		queryFn: async () => {
			return await apiClient.get<BaseUser>('/users/me');
		},
	});
};
