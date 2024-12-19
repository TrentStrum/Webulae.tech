'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

import { apiClient } from '@/src/lib/apiClient';

import type { DatabaseProfile } from '@/src/types/user.types';

interface AuthState {
	user: DatabaseProfile | null;
	isPending: boolean;
	setUser: (user: DatabaseProfile | null) => void;
}

export function useAuthState(): AuthState {
	const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
	const [user, setUser] = useState<DatabaseProfile | null>(null);
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		async function fetchDatabaseProfile(): Promise<void> {
			if (!clerkUser?.id || !clerkLoaded) {
				setUser(null);
				setIsPending(false);
				return;
			}

			try {
				const { data: profile } = await apiClient.get<DatabaseProfile>(`/api/profiles/${clerkUser.id}`);
				setUser(profile);
			} catch (error) {
				console.error('Error fetching database profile:', error);
				setUser(null);
			} finally {
				setIsPending(false);
			}
		}

		void fetchDatabaseProfile();
	}, [clerkUser?.id, clerkLoaded]);

	return { user, isPending, setUser };
}
