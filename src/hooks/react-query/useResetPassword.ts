'use client';

import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { useToast } from '@/src/hooks';
import { apiClient } from '@/src/lib/apiClient';

interface ResetPasswordData {
	email: string;
}

export const useResetPassword = (): UseMutationResult<void, Error, ResetPasswordData> => {
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: ResetPasswordData): Promise<void> => {
			if (!apiClient) throw new Error('API client not initialized');

			await apiClient.post('/auth/reset-password', {
				email: data.email,
				redirectTo: `${window.location.origin}/auth/update-password`,
			});
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
};
