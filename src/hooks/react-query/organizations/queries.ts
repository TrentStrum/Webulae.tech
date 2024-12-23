import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Organization } from '@/src/types/organization.types';
import type { UseQueryResult } from '@tanstack/react-query';

export function useOrganization(id: string): UseQueryResult<ApiResponse<Organization>, ApiError> {
	return useApiQuery<Organization>(
		queryKeys.organizations.detail(id),
		endpoints.organizations.detail(id)
	);
}

export function useOrganizationSettings(id: string): UseQueryResult<ApiResponse<Organization>, ApiError> {
	return useApiQuery<Organization>(
		queryKeys.organizations.settings(id),
		endpoints.organizations.settings(id)
	);
}