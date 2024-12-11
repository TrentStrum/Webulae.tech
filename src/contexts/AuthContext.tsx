'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { apiClient } from '../lib/apiClient';

import type { AuthState } from '../types/auth.types';
import type { AuthUser } from '../types/user.types';
import type { ReactNode } from 'react';

// Routes that don't need auth subscription
const PUBLIC_ROUTES = ['/', '/blog', '/contact', '/about'];

export const AuthContext = createContext<AuthState<AuthUser> | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
	const queryClient = useQueryClient();
	const pathname = usePathname();
	const [authState, setAuthState] = useState<AuthState<AuthUser>>({
		user: null,
		isAuthenticated: false,
		isPending: false, // Changed to false for public routes
	});

	useEffect(() => {
		// Skip auth subscription for public routes
		if (PUBLIC_ROUTES.some((route) => pathname?.startsWith(route))) {
			return;
		}

		const { subscription } = apiClient.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				const profile = await apiClient.auth.getProfile<AuthUser>();
				setAuthState({
					user: profile.data,
					isAuthenticated: true,
					isPending: false,
				});
				queryClient.setQueryData(['auth', 'user'], profile.data);
			} else {
				setAuthState({
					user: null,
					isAuthenticated: false,
					isPending: false,
				});
				queryClient.setQueryData(['auth', 'user'], null);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [queryClient, pathname]);

	return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState<AuthUser> {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
