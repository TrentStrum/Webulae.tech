'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { apiClient } from '../lib/apiClient';

import type { AuthState } from '../types/auth.types';
import type { AuthUser } from '../types/user.types';
import type { ReactNode } from 'react';

export const AuthContext = createContext<AuthState<AuthUser> | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
	const queryClient = useQueryClient();
	const [authState, setAuthState] = useState<AuthState<AuthUser>>({
		user: null,
		isAuthenticated: false,
		isPending: true,
	});

	useEffect(() => {
		const { subscription } = apiClient.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				const profile = await apiClient.auth.getProfile<AuthUser>();
				const newState = {
					user: profile.data,
					isAuthenticated: true,
					isPending: false,
				};
				setAuthState(newState);
				queryClient.setQueryData(['auth', 'user'], profile.data);
			} else {
				const newState = {
					user: null,
					isAuthenticated: false,
					isPending: false,
				};
				setAuthState(newState);
				queryClient.setQueryData(['auth', 'user'], null);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [queryClient]);

	return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState<AuthUser> {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
