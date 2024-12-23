'use client';

import { useOrganization } from '@clerk/nextjs';

import { hasPermission } from '@/src/lib/permissions';

import type { Permission } from '@/src/types/permissions.types';


interface PermissionsHook {
	can: (permission: Permission) => boolean;
	role: string | null;
	isLoading: boolean;
}

export function usePermissions(): PermissionsHook {
	const { membership, isLoaded } = useOrganization();

	return {
		can: (permission: Permission) => hasPermission(membership?.role ?? null, permission),
		role: membership?.role ?? null,
		isLoading: !isLoaded,
	};
}
