import { getAuth } from '@clerk/nextjs/server';

import type { OrganizationInvitationJSON } from '@clerk/types';
import type { NextRequest } from 'next/server';

export async function inviteToOrganization(
	organizationId: string,
	emailAddress: string,
	role: string,
	request: NextRequest
): Promise<OrganizationInvitationJSON> {
	try {
		const { getToken } = getAuth(request);
		const token = await getToken();
		const invitation = await fetch(`https://api.clerk.com/v1/organizations/${organizationId}/invitations`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email_address: emailAddress, role }),
		}).then(res => res.json());

		return invitation;
	} catch (error) {
		console.error('Failed to invite member:', error);
		throw error;
	}
}
