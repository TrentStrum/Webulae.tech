'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthState } from '../auth/use-auth-state';

import { useToast } from './use-toast';

interface NavigationGuardProps {
	allowedRoles?: string[];
	requireAuth?: boolean;
}

export function useNavigationGuard({
	allowedRoles = [],
	requireAuth = false
}: NavigationGuardProps = {}): { isPending: boolean } {
	const { isLoaded, isSignedIn } = useUser();
	const { user, isPending: isProfilePending } = useAuthState();
	const router = useRouter();
	const pathname = usePathname();
	const { toast } = useToast();

	useEffect(() => {
		if (!isLoaded || isProfilePending) return;

		if (requireAuth && !isSignedIn) {
			router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
			return;
		}

		if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
				toast({
					title: 'Access Denied',
					description: 'You do not have permission to access this page',
					variant: 'destructive',
				});
				router.push('/');
		}
	}, [isLoaded, isSignedIn, user, isProfilePending, allowedRoles, pathname, router, toast, requireAuth]);

	return { isPending: !isLoaded || isProfilePending };
}
