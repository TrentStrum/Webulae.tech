import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { queryClient } from '@/src/lib/cache/queryCache';

import { useApiMutation } from '../base-queries';

import type { ApiError } from '@/src/types/api.types';
import type { Organization } from '@/src/types/organization.types';
import type { UseMutationResult } from '@tanstack/react-query';


export function useUpdateOrganization(): UseMutationResult<Organization, ApiError, Partial<Organization>> {
	return useApiMutation<Organization, Partial<Organization>>(endpoints.organizations.base, {
		onSuccess: (_, variables) => {
			if (variables.id) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.organizations.detail(variables.id),
				});
			}
		},
	});
}

export function useUpdateOrganizationSettings(): UseMutationResult<Organization, ApiError, Partial<Organization>> {
	return useApiMutation<Organization, Partial<Organization>>(endpoints.organizations.settings, {
		onSuccess: (_, variables) => {
			if (variables.id) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.organizations.settings(variables.id),
				});
			}
		},
	});
}
