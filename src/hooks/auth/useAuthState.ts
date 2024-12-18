'use client';

import { useState } from 'react';

import type { DatabaseProfile } from '@/src/types/user.types';

interface AuthState {
	user: DatabaseProfile | null;
	loading: boolean;
	setUser: (user: DatabaseProfile | null) => void;
	setLoading: (loading: boolean) => void;
}

export function useAuthState(): AuthState {
	const [user, setUser] = useState<DatabaseProfile | null>(null);
	const [loading, setLoading] = useState(true);

	return { user, loading, setUser, setLoading };
}
