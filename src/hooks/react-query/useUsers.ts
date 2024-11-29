import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/src/lib/supabaseClient';

export const useUsers = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const { data, error } = await supabaseClient
				.from('profiles')
				.select('id, role, username, full_name, auth_users(email)')
				.order('role', { ascending: false });

			if (error) throw error;

			return data.map((user: any) => ({
				...user,
				email: user.auth_users?.email || null,
			}));
		},
	});

	return { users: data || [], isLoading };
};

export const useToggleUserRole = () => {
	const queryClient = useQueryClient();

	const roles = {
		client: 'developer',
		developer: 'admin',
		admin: 'client',
	} as const;

	return useMutation<void, Error, { userId: string; currentRole: string }>({
		mutationFn: async ({ userId, currentRole }) => {
			const newRole = roles[currentRole as keyof typeof roles] || 'client';
			const { error } = await supabaseClient
				.from('profiles')
				.update({ role: newRole })
				.eq('id', userId);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const { data: { user }, error } = await supabaseClient.auth.getUser();
			if (error) throw error;
			return user;
		}
	});
};
