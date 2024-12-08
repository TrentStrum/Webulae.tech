'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthState } from '../auth/useAuthState';

import { useToast } from './use-toast';

import type { AuthUser } from '@/src/types/authUser.types';

interface NavigationGuardProps {
	allowedRoles?: string[];
	requireAuth?: boolean;
	redirectTo?: string;
}

export function useNavigationGuard({
	allowedRoles = [],
	requireAuth = true,
	redirectTo = '/auth/login',
}: NavigationGuardProps = {}): { isLoading: boolean; user: AuthUser | null } {
	const { user, loading } = useAuthState();
	const router = useRouter();
	const pathname = usePathname();
	const { toast } = useToast();

	useEffect(() => {
		if (loading) return;

		const handleNavigation = async (): Promise<void> => {
			// Not authenticated but authentication required
			if (!user && requireAuth) {
				toast({
					title: 'Authentication Required',
					description: 'Please log in to access this page',
					variant: 'destructive',
				});
				router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
				return;
			}

			// Role-based access check
			if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
				toast({
					title: 'Access Denied',
					description: 'You do not have permission to access this page',
					variant: 'destructive',
				});
				router.push('/');
				return;
			}
		};

		handleNavigation();
	}, [user, loading, router, pathname, redirectTo, requireAuth, allowedRoles, toast]);

	return { isLoading: loading, user };
}
