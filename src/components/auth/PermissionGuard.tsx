'use client';

import { usePermissions } from '@/src/hooks/helpers/usePermissions';

import type { Permission } from '@/src/lib/permissions';


interface PermissionGuardProps {
	children: React.ReactNode;
	permission: Permission;
	fallback?: React.ReactNode;
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
	const { can } = usePermissions();

	if (!can(permission)) {
		return fallback;
	}

	return children;
}
