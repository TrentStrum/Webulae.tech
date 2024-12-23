import { currentUser, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ROLE_PERMISSIONS } from './roles';

import type { PermissionType, Role } from './roles';
import type { Permission } from '@/src/types/permissions.types';
import type { NextRequest } from 'next/server';
import type { ReactNode } from 'react';

type RouteHandler = (request: NextRequest) => Promise<Response>;

export interface AuthGuardOptions {
	redirectTo?: string;
	permissions?: Permission[];
	requireOrg?: boolean;
	allowedRoles?: Role[];
}

export async function checkAuth({
	redirectTo = '/login',
	permissions = [],
	requireOrg = false,
	allowedRoles = [],
}: AuthGuardOptions = {}): Promise<{ userId: string; orgId: string | null; role: Role }> {
	const { userId, orgId } = auth();

	if (!userId) {
		redirect(redirectTo);
	}

	const user = await currentUser();
	const role = user?.publicMetadata.role as Role;

	if (requireOrg && !orgId) {
		redirect('/organizations/select');
	}

	if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
		redirect('/unauthorized');
	}

	if (permissions.length > 0) {
		const hasRequiredPermissions = permissions.every((permission) =>
			ROLE_PERMISSIONS[role]?.includes(permission as PermissionType)
		);

		if (!hasRequiredPermissions) {
			redirect('/unauthorized');
		}
	}

	return {
		userId,
		orgId: orgId ?? null,
		role,
	};
}

export const authGuard = (handler: RouteHandler, options: AuthGuardOptions = {}) => {
	return async (request: NextRequest) => {
		await checkAuth(options);
		return handler(request);
	};
};

interface AuthGuardProps {
	children: ReactNode;
	options?: AuthGuardOptions;
}

export async function AuthGuard({ children, options = {} }: AuthGuardProps): Promise<JSX.Element> {
	try {
		await checkAuth(options);
	} catch (error) {
		redirect('/unauthorized');
	}

	return children as JSX.Element;
}
