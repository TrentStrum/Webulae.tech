import type { OrganizationMembershipRole } from '@clerk/nextjs/server';

export type Role = OrganizationMembershipRole;

export type Permission =
	| 'users:read'
	| 'users:write'
	| 'settings:read'
	| 'settings:write'
	| 'billing:read'
	| 'billing:write'
	| 'analytics:read'
	| 'analytics:write';

export interface AuthUser {
	id: string;
	role: Role;
}

export interface UseAuthReturn {
	user: AuthUser | null;
	role: Role | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}
