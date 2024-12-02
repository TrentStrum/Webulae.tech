'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/src/services/authService';
import { useRouter } from 'next/navigation';
import { AuthError, AuthResponse } from '@supabase/supabase-js';

type LoginCredentials = {
	email: string;
	password: string;
};

export function useLoginMutation() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation<AuthResponse, Error, LoginCredentials>({
		mutationFn: async ({ email, password }) => {
			return await authService.login(email, password);
		},
		onSuccess: async (data) => {
			if (data.data.user) {
				const profile = await authService.getUserProfile(data.data.user.id);
				queryClient.setQueryData(['auth', 'user'], profile);

				// Redirect based on user role
				if (profile.role === 'admin') {
					router.push('/admin/dashboard');
				} else if (profile.role === 'developer') {
					router.push('/developer/dashboard');
				} else {
					router.push('/dashboard');
				}
			}
		},
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationKey: ['auth', 'logout'],
		mutationFn: async () => {
			console.log('🔄 useLogoutMutation: Starting logout');
			const result = await authService.logout();
			if (result.error) {
				throw result.error;
			}
			return result;
		},
		onMutate: () => {
			console.log('🚀 useLogoutMutation: Mutation starting');
		},
		onSuccess: () => {
			console.log('✅ useLogoutMutation: Success');
			queryClient.setQueryData(['auth', 'user'], null);
			queryClient.invalidateQueries({ queryKey: ['auth'] });
			router.push('/auth/login');
		},
		onError: (error) => {
			console.error('❌ useLogoutMutation: Error:', error);
		}
	});
}
