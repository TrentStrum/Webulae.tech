import { OrganizationProfile } from '@clerk/nextjs';

export function OrgProfile() {
	return (
		<OrganizationProfile
			appearance={{
				elements: {
					rootBox: {
						boxShadow: 'none',
						width: '100%',
					},
				},
			}}
		/>
	);
}
