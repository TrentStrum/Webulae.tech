'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useToast } from '@/src/hooks/helpers/use-toast';

interface AuthGuardProps {
	children: ReactNode;
	allowedRoles?: string[];
	redirectTo?: string;
}

export function AuthGuard({ 
	children, 
	allowedRoles = [], 
	redirectTo = '/sign-in' 
}: AuthGuardProps): JSX.Element | null {
	const { isLoaded, userId, sessionId, getToken } = useAuth();
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		const checkAuth = async (): Promise<void> => {
			if (!isLoaded) return;

			if (!userId || !sessionId) {
				toast({
					title: 'Authentication Required',
					description: 'Please sign in to access this page.',
					variant: 'destructive',
				});
				router.push(redirectTo);
				return;
			}

			if (allowedRoles.length > 0) {
				try {
					// Get the JWT token which includes user roles
					const token = await getToken();
					const tokenData = JSON.parse(atob(token!.split('.')[1]));
					const userRoles = tokenData.roles || [];

					const hasAllowedRole = allowedRoles.some(role => 
						userRoles.includes(role)
					);

					if (!hasAllowedRole) {
						toast({
							title: 'Access Denied',
							description: 'You do not have permission to access this page.',
							variant: 'destructive',
						});
						router.push('/dashboard');
					}
				} catch (error) {
					console.error('Error checking roles:', error);
					router.push('/dashboard');
				}
			}
		};

		void checkAuth();
	}, [isLoaded, userId, sessionId, allowedRoles, router, redirectTo, toast, getToken]);

	if (!isLoaded) {
		return null; // Or return a loading spinner
	}

	return <>{children}</>;
}