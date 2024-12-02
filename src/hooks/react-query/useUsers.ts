import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import { User } from '@/src/types/user.types';
import { apiClient } from '@/src/lib/apiClient';

export const useUsers = () => {
	return useQuery<User[], Error>({
		queryKey: ['users'],
		queryFn: async () => {
			return await apiClient.get<User[]>('/users');
		},
		staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
	});
};

export const useToggleUserRole = () => {
	const queryClient = useQueryClient();

	const roles = {
		client: 'developer',
		developer: 'admin',
		admin: 'client',
	} as const;

	return useMutation<void, Error, { userId: string; currentRole: keyof typeof roles }>({
		mutationFn: async ({ userId, currentRole }) => {
			const newRole = roles[currentRole] || 'client';
			const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useCurrentUser = () => {
	type SupabaseUser = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];

	return useQuery<SupabaseUser, Error>({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error) throw error;
			return user;
		},
	});
};
