export type Permission =
	| 'view:dashboard'
	| 'manage:users'
	| 'manage:settings'
	| 'view:reports'
	| 'manage:billing';

type RolePermissions = {
	[key: string]: Permission[];
};

export const ROLE_PERMISSIONS: RolePermissions = {
	'org:admin': [
		'view:dashboard',
		'manage:users',
		'manage:settings',
		'view:reports',
		'manage:billing',
	],
	'org:developer': ['view:dashboard', 'manage:users', 'view:reports'],
	'org:member': ['view:dashboard'],
};

export function hasPermission(role: string | null, permission: Permission): boolean {
	if (!role) return false;
	return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
