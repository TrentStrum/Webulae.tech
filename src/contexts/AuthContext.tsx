'use client';

import { createContext, useContext } from 'react';
import { AuthUser } from '@/src/types/authUser.types';
import { useAuthState } from '@/src/hooks/auth/useAuthState';

interface AuthContextType {
	user: AuthUser | null;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { user = null, isLoading } = useAuthState();

	return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
}
