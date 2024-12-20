import { describe, expect, it } from '@jest/globals';

import { InvitationService } from '@/src/lib/services/invitation-service';
import { supabase } from '@/src/lib/supabase';

describe('Invitation Flow', () => {
	it('should create an invitation', async () => {
		const email = `test-${Date.now()}@example.com`;
		const organizationId = 'test-org-id';

		const invitation = await InvitationService.createInvitation(organizationId, email);

		expect(invitation).toBeTruthy();
		expect(invitation.email).toBe(email);
		expect(invitation.organization_id).toBe(organizationId);
		expect(invitation.token).toBeTruthy();
		expect(invitation.used_at).toBeNull();
	});

	it('should verify valid invitations', async () => {
		const email = `test-${Date.now()}@example.com`;
		const organizationId = 'test-org-id';

		const invitation = await InvitationService.createInvitation(organizationId, email);

		const verified = await InvitationService.verifyInvitation(invitation.token);
		expect(verified).toBeTruthy();
		expect(verified.token).toBe(invitation.token);
	});

	it('should reject expired invitations', async () => {
		// Create an expired invitation by manipulating the expires_at date
		const email = `test-${Date.now()}@example.com`;
		const organizationId = 'test-org-id';

		const invitation = await InvitationService.createInvitation(organizationId, email);

		// Manually expire the invitation
		await supabase
			.from('invitations')
			.update({
				expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
			})
			.eq('token', invitation.token);

		await expect(InvitationService.verifyInvitation(invitation.token)).rejects.toThrow(
			'Invitation has expired'
		);
	});

	it('should mark invitations as used', async () => {
		const email = `test-${Date.now()}@example.com`;
		const organizationId = 'test-org-id';

		const invitation = await InvitationService.createInvitation(organizationId, email);

		await InvitationService.markInvitationAsUsed(invitation.token);

		const { data } = await supabase
			.from('invitations')
			.select('used_at')
			.eq('token', invitation.token)
			.single();

		expect(data?.used_at).toBeTruthy();
	});
});
