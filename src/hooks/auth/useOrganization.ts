import { useOrganization } from '@clerk/nextjs';

import type { OrganizationResource, OrganizationMembershipResource } from '@clerk/types';

interface OrganizationState {
	organization: OrganizationResource | null | undefined;
	isLoaded: boolean;
	isPending: boolean;
	membership: OrganizationMembershipResource | null | undefined;
	membershipList: OrganizationMembershipResource[] | null | undefined;
}

export function useCurrentOrganization(): OrganizationState {
	const org = useOrganization();

	return {
		organization: org.organization,
		isLoaded: org.isLoaded,
		isPending: !org.isLoaded,
		membership: org.membership,
		membershipList: org.memberships?.data,
	};
}
