import { auth, currentUser } from '@clerk/nextjs/server';

// Define the permission strings as a union type
export type PermissionType = 
	| 'manage_users'
	| 'manage_organizations'
	| 'manage_roles'
	| 'manage_settings'
	| 'view_organizations'
	| 'view_settings';

// Define permissions object
export const Permissions: Record<string, PermissionType> = {
	MANAGE_USERS: 'manage_users',
	MANAGE_ORGANIZATIONS: 'manage_organizations',
	MANAGE_ROLES: 'manage_roles',
	MANAGE_SETTINGS: 'manage_settings',
	VIEW_ORGANIZATIONS: 'view_organizations',
	VIEW_SETTINGS: 'view_settings',
};

// Define role permissions with explicit types
export const ROLE_PERMISSIONS: Record<string, readonly PermissionType[]> = {
	admin: [
		Permissions.MANAGE_USERS,
		Permissions.MANAGE_ORGANIZATIONS,
		Permissions.MANAGE_ROLES,
		Permissions.MANAGE_SETTINGS,
	],
	manager: [
		Permissions.MANAGE_ORGANIZATIONS,
		Permissions.MANAGE_SETTINGS,
	],
	user: [
		Permissions.VIEW_ORGANIZATIONS,
		Permissions.VIEW_SETTINGS,
	],
} as const;

export type Role = keyof typeof ROLE_PERMISSIONS;
export type Permission = PermissionType;

// Simple permission check
export async function hasPermission(requiredPermission: Permission): Promise<boolean> {
	try {
		const { userId } = await auth();
		if (!userId) return false;

		const user = await currentUser();
		if (!user) return false;

		const role = user.publicMetadata.role as Role | undefined;
		if (!role || !(role in ROLE_PERMISSIONS)) return false;

		return ROLE_PERMISSIONS[role].includes(requiredPermission);
	} catch (error) {
		console.error('Permission check failed:', error);
		return false;
	}
}

// Middleware creator
export function createPermissionMiddleware(permission: Permission) {
	return async function middleware(_req: Request): Promise<Response | void> {
		const allowed = await hasPermission(permission);
		
		if (!allowed) {
			return new Response('Unauthorized', { status: 403 });
		}
	};
}

// Synchronous permission check (for components)
export function checkPermission(role: Role, permission: Permission): boolean {
	const permissions = ROLE_PERMISSIONS[role];
	return permissions.includes(permission as typeof permissions[number]);
}
