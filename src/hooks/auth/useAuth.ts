import { useUser, useOrganization } from '@clerk/nextjs';

import type { OrganizationMembershipRole } from '@clerk/nextjs/server';

interface UseAuthReturn {
	user: ReturnType<typeof useUser>['user'];
	organization: ReturnType<typeof useOrganization>['organization'];
	isLoading: boolean;
	role: OrganizationMembershipRole | null;
	isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
	const { user, isLoaded: isUserLoaded } = useUser();
	const { organization, isLoaded: isOrgLoaded } = useOrganization();

	const role = user?.organizationMemberships?.[0]?.role ?? null;

	return {
		user,
		organization,
		isLoading: !isUserLoaded || !isOrgLoaded,
		role,
		isAuthenticated: !!user,
	};
}
