import { useOrganization } from '@clerk/nextjs';

import type { OrganizationMembershipResource } from '@clerk/types';

export type Permission = 
	| 'users:write'
	| 'users:read'
	| 'developer:access'
	| 'admin:access'
	| 'settings:read'
	| 'settings:write'
	| 'analytics:read'
	| 'members:invite';

type Role = 'org:admin' | 'org:developer' | 'org:member' | null;

const rolePermissions: Record<NonNullable<Role>, Permission[]> = {
	'org:admin': ['users:write', 'users:read', 'admin:access'],
	'org:developer': ['developer:access', 'users:read'],
	'org:member': ['users:read']
};

export function hasPermission(role: Role, permission: Permission): boolean {
	if (!role) return false;
	return rolePermissions[role]?.includes(permission) ?? false;
}

interface PermissionsAPI {
	can: (permission: Permission) => boolean;
}

export function usePermissions(): PermissionsAPI {
	const { organization } = useOrganization();
	
	const can = (permission: Permission): boolean => {
		const role = (organization as unknown as OrganizationMembershipResource)?.role ?? null;
		return hasPermission(role as Role, permission);
	};
	
	return { can };
}
