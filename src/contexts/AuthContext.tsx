'use client';

import { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthState } from '@/src/hooks/auth/useAuthState';
import { setupAuthListener } from '@/src/lib/supabase';

const AuthContext = createContext<ReturnType<typeof useAuthState> | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const authState = useAuthState();
	const queryClient = useQueryClient();

	useEffect(() => {
		return setupAuthListener((event, session) => {
			queryClient.setQueryData(['auth', 'user'], session?.user || null);
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
