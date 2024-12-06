'use client';

import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/src/hooks';
import { supabase } from '@/src/lib/supabase';

interface ResetPasswordData {
	email: string;
}

export const useResetPassword = () => {
	const { toast } = useToast();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: ResetPasswordData): Promise<void> => {
			if (!supabase) throw new Error('Supabase client not initialized');

			const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
				redirectTo: `${window.location.origin}/auth/update-password`,
			});

			if (error) throw error;
		},
		onSuccess: (): void => {
			toast({
				title: 'Password Reset Email Sent',
				description: 'Check your email for the password reset link.',
			});
		},
		onError: (error: Error): void => {
			toast({
				title: 'Error',
				description: error.message || 'Failed to send reset email.',
				variant: 'destructive',
			});
		},
	});

	return {
		resetPassword: (data: ResetPasswordData) => mutateAsync(data),
		isLoading: isPending,
	};
};
