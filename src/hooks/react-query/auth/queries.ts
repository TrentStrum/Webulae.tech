import { useQuery, useMutation } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { apiClient } from '@/src/lib/apiClient';

import { useApiQuery , useApiMutation } from '../base-queries';

import type { ApiError , ApiResponse } from '@/src/types/api.types';
import type { Account, Profile } from '@/src/types/auth.types';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';



export function useProfile(): UseQueryResult<{ data: Profile }, Error> {
	return useQuery({
		queryKey: queryKeys.users.profile,
		queryFn: () => apiClient.get<{ data: Profile }>(endpoints.users.profile),
	});
}

export function useUpdateProfile(): UseMutationResult<AxiosResponse, Error, Partial<Profile>> {
	return useMutation({
		mutationFn: (data: Partial<Profile>) => apiClient.patch(endpoints.users.profile, data),
	});
}

export function useAccount(): UseQueryResult<ApiResponse<Account>, ApiError> {
	return useApiQuery<Account>(
		queryKeys.auth.account,
		endpoints.auth.account
	);
}

export function useUpdateAccount(): UseMutationResult<AxiosResponse<Account>, ApiError, Partial<Account>> {
	return useApiMutation<AxiosResponse<Account>, Partial<Account>>(endpoints.auth.account);
}

export function useUpdatePassword(): UseMutationResult<AxiosResponse<void>, ApiError, { 
	currentPassword: string;
	newPassword: string;
}> {
	return useApiMutation(endpoints.auth.password);
}
