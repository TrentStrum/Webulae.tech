import { useAuth } from '@/src/hooks/auth/useAuth';
import { hasPermission } from '@/src/lib/auth/permissions';

import type { Permission } from '@/src/types/permissions.types';
import type { UserResource } from '@clerk/types';


interface UsePermissionsReturn {
	can: (permission: Permission) => boolean;
}

export function usePermissions(): UsePermissionsReturn {
	const { user } = useAuth();

	return {
			can: (permission: Permission) => hasPermission(user as UserResource | null, permission),
	};
} 