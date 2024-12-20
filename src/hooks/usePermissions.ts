'use client';

import { useOrganization } from '@clerk/nextjs';

import { hasPermission, type Permission } from '@/src/lib/permissions';

interface PermissionsHook {
	can: (permission: Permission) => boolean;
	role: string | null | undefined;
}

export function usePermissions(): PermissionsHook {
	const { membership } = useOrganization();

	return {
		can: (permission: Permission) => hasPermission(membership?.role ?? null, permission),
		role: membership?.role ?? null,
	};
}
