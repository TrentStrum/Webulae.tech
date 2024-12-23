import { useQuery, useMutation } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { OrganizationSettings } from '@/src/types/organization.types';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';


export const useOrganization = (): UseQueryResult<OrganizationSettings> =>
	useQuery({
		queryKey: ['organization'],
		queryFn: () => apiClient.get('/organization'),
	});

export const useUpdateOrganization = (): UseMutationResult<void, unknown, OrganizationSettings> =>
	useMutation({
		mutationFn: async (data: OrganizationSettings): Promise<void> => {
			await apiClient.patch('/organization', data);
		},
	});
