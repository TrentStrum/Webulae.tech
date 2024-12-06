'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { supabase } from '@/src/lib/supabase';

export const useLogout = (): {
	logout: () => Promise<void>;
	isLoading: boolean;
} => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { toast } = useToast();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (): Promise<void> => {
			if (!supabase) throw new Error('Supabase client not initialized');
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			localStorage.clear();
			sessionStorage.clear();

			document.cookie.split(';').forEach((cookie) => {
				document.cookie = cookie
					.replace(/^ +/, '')
					.replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
			});

			queryClient.clear();

			if (window.opener) {
				window.opener.postMessage({ type: 'logout' }, '*');
			}
		},
		onSuccess: (): void => {
			queryClient.removeQueries();
			toast({
				title: 'Logged out successfully',
				description: 'You have been securely logged out.',
			});
			router.push('/auth/login');
			router.refresh();
		},
		onError: (error: Error): void => {
			console.error('Logout error:', error);
			toast({
				title: 'Error',
				description: 'Failed to log out. Please try again.',
				variant: 'destructive',
			});
		},
	});

	return {
		logout: () => mutateAsync(),
		isLoading: isPending,
	};
};
