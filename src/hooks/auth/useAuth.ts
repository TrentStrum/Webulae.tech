'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/src/services/authService';
import { useEffect } from 'react';
import { AuthUser } from '@/src/types/user.types';

export function useAuth() {
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery<AuthUser | null>({
		queryKey: ['auth', 'user'],
		queryFn: async () => {
			const session = await authService.getSession();
			if (!session?.user) return null;
			return authService.getUserProfile(session.user.id);
		},
		staleTime: Infinity,
	});

	useEffect(() => {
		const subscription = authService.onAuthStateChange((user) => {
			queryClient.setQueryData(['auth', 'user'], user);
		});

		return () => {
			subscription.data.subscription.unsubscribe();
		};
	}, [queryClient]);

	return { user, isLoading };
}
