import { useOrganization } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server';

import type { Permission } from '@/src/types/permissions.types';

export function useHasPermission(permission: Permission): boolean {
	const { membership } = useOrganization();
	console.log('Permission check - membership:', membership);
	
	// Check for exact role format from Clerk ('org:admin')
	const role = membership?.role || '';
	console.log('Permission check - role:', role);
	
	return checkPermission(role, permission);
}

function checkPermission(role: string, permission: Permission): boolean {
	console.log('Checking permission:', { role, permission });
	
	switch (role) {
		case 'org:admin':  // Match exact role from Clerk
			return true;
		case 'org:developer':
			return !['manage_users'].includes(permission);
		case 'org:member':
			return ['users:read', 'settings:read'].includes(permission);
		default:
			console.log('No matching role found, defaulting to false');
			return false;
	}
}

export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
	const memberships = await clerkClient.users.getOrganizationMembershipList({ userId });
	const role = memberships[0]?.role?.replace('org:', '') || '';
	
	switch (role) {
		case 'admin':
			return true;
		case 'developer':
			return !['manage_users'].includes(permission);
		case 'member':
			return ['users:read', 'settings:read'].includes(permission);
		default:
			return false;
	}
}
