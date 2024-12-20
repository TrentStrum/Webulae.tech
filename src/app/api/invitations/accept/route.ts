import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { InvitationService } from '@/src/lib/services/invitation-service';
import { supabase } from '@/src/lib/supabase';

import type { ClerkUserRole } from '@/src/types/clerk.types';


export async function GET(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get('token');
	const { userId } = await auth();

	if (!token || !userId) {
		console.warn('Missing token or userId in invitation acceptance');
		return NextResponse.redirect(new URL('/invalid-invitation', request.url));
	}

	try {
		const invitation = await InvitationService.verifyInvitation(token);

		// Validate invitation hasn't expired
		const now = new Date();
		if (new Date(invitation.expires_at) < now) {
			console.warn('Attempted to use expired invitation', { token });
			return NextResponse.redirect(new URL('/invalid-invitation?reason=expired', request.url));
		}

		// Map invitation role to Clerk role format
		const clerkRole = `org:${invitation.role}` as `org:${ClerkUserRole}`;

		// Add user to organization in Clerk
		await addUserToOrganization(userId, invitation.organizations.clerk_org_id, clerkRole);

		// Mark invitation as used
		await InvitationService.markInvitationAsUsed(token);

		// Sync user with database if needed
		await syncUserToOrganization(userId, invitation.organizations.id);

		return NextResponse.redirect(new URL('/dashboard', request.url));
	} catch (error) {
		console.error('Error accepting invitation:', error);
		return NextResponse.redirect(new URL('/invalid-invitation?reason=error', request.url));
	}
}

async function addUserToOrganization(
	userId: string, 
	organizationId: string, 
	role: `org:${ClerkUserRole}`
): Promise<void> {
	try {
		await (await clerkClient()).organizations.createOrganizationMembership({
			organizationId,
			userId,
			role,
		});
	} catch (error) {
		console.error('Error adding user to organization:', error);
		throw error;
	}
}

async function syncUserToOrganization(userId: string, organizationId: string): Promise<void> {
	try {
		// Get user details from Clerk
		const clerkUser = await (await clerkClient()).users.getUser(userId);
		
		// Sync user to Supabase
		await supabase
			.from('users')
			.upsert({
				clerk_id: userId,
				clerk_org_id: organizationId,
				email: clerkUser.emailAddresses[0].emailAddress,
				full_name: `${clerkUser.firstName} ${clerkUser.lastName}`,
				role: 'client', // New users through invitation are clients by default
			})
			.select()
			.single();

	} catch (error) {
		console.error('Error syncing user to organization:', error);
		// Don't throw - we want the invitation process to succeed
		// even if the sync fails
	}
}
