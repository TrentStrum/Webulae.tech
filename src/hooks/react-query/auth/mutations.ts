import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { AxiosResponse } from 'axios';


export function useResetPassword(): UseMutationResult<AxiosResponse, Error, { email: string }> {
	return useMutation({
		mutationFn: (data: { email: string }) => apiClient.post('/api/auth/reset-password', data),
	});
}
