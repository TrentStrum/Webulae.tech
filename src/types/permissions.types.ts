export type Permission = 
	| 'users:write'
	| 'users:read'
	| 'developer:access'
	| 'admin:access'
	| 'settings:read'
	| 'settings:write'
	| 'analytics:read'
	| 'members:invite'
	| 'manage_users';

// Remove any duplicate Permission type definitions from other files 