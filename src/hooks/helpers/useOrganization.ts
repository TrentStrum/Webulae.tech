import { useOrganization as useClerkOrganization } from '@clerk/nextjs';

import type { Organization } from '@/src/types/organization.types';

interface OrganizationHookReturn {
	organization: Organization | null;
	isLoading: boolean;
}

export function useOrganization(): OrganizationHookReturn {
	const { organization, isLoaded } = useClerkOrganization();

	return {
		organization: organization as Organization | null,
		isLoading: !isLoaded,
	};
}
