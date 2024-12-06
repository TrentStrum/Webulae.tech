'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';

import { useAuthState } from '@/src/hooks/auth/useAuthState';
import { setupAuthListener } from '@/src/lib/supabase';

import type { User } from '@/src/types/user.types';

const AuthContext = createContext<ReturnType<typeof useAuthState> | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const authState = useAuthState();
	const queryClient = useQueryClient();

	useEffect(() => {
		return setupAuthListener((event, session) => {
			const user = session?.user as User | null;
			queryClient.setQueryData(['auth', 'user'], user);
		});
	}, [queryClient]);

	return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
