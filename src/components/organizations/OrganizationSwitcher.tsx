'use client';

import { OrganizationSwitcher as ClerkOrgSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export function OrganizationSwitcher() {

	return (
		<ClerkOrgSwitcher
			appearance={{
				baseTheme: dark,
				elements: {
					rootBox: 'w-[300px]',
					organizationSwitcherTrigger: 'w-[300px]',
				},
			}}
			afterCreateOrganizationUrl="/organization/settings"
			afterSelectOrganizationUrl="/dashboard"
			afterLeaveOrganizationUrl="/select-organization"
			hidePersonal
		/>
	);
}
