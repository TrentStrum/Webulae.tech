import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

interface LoginPayload {
	email: string;
	password: string;
}

interface LoginOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useLogin = ({
	onSuccess,
	onError,
}: LoginOptions): UseMutationResult<void, Error, LoginPayload> => {
	return useMutation({
		mutationFn: async ({ email, password }: LoginPayload) => {
			await apiClient.post('/auth/login', { email, password });
		},
		onSuccess,
		onError,
	});
};
