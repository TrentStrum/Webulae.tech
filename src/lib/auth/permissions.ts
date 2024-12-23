import type { Permission } from '@/src/types/permissions.types';
import type { UserResource } from '@clerk/types';

export function hasPermission(user: UserResource | null | undefined, permission: Permission): boolean {
	if (!user) return false;
	
	const role = user.publicMetadata.role as string;
	
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
