'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authService } from '@/src/services/authService';

import { useToast } from '../helpers/use-toast';

import type { AuthResponse } from '@supabase/supabase-js';

type LoginCredentials = {
	email: string;
	password: string;
};

export function useLoginMutation() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { toast } = useToast();

	return useMutation<AuthResponse, Error, LoginCredentials>({
		mutationFn: async ({ email, password }) => {
			const response = await authService.login(email, password);
			if (response.error) {
				throw new Error(response.error.message);
			}
			return response;
		},
		onSuccess: async (data) => {
			if (data.data.user) {
				const profile = await authService.getUserProfile(data.data.user.id);
				queryClient.setQueryData(['auth', 'user'], profile);
				toast({
					title: 'Success',
					description: 'Successfully logged in',
				});

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
		onError: (error) => {
			toast({
				title: 'Login Failed',
				description: error.message || 'Invalid email or password',
				variant: 'destructive',
			});
		},
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { toast } = useToast();

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
			toast({
				title: 'Success',
				description: 'Successfully logged out',
			});
			router.push('/auth/login');
		},
		onError: (error: Error) => {
			console.error('❌ useLogoutMutation: Error:', error);
			toast({
				title: 'Error',
				description: 'Failed to log out. Please try again.',
				variant: 'destructive',
			});
		},
	});
}
