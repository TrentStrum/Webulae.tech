'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../lib/supabaseClient';
    
export interface AuthUser {
	id: string;
	email: string;
	role: 'client' | 'admin' | 'developer';
	avatar_url?: string | null;
}

export function useAuthState() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			try {
				const {
					data: { session },
				} = await supabaseClient.auth.getSession();

				if (session?.user) {
					const { data: profile } = await supabaseClient
						.from('profiles')
						.select('role, avatar_url')
						.eq('id', session.user.id)
						.single();

					if (profile) {
						setUser({
							id: session.user.id,
							email: session.user.email!,
							role: profile.role || 'client',
							avatar_url: profile.avatar_url,
						});
					}
				}
			} catch (error) {
				console.error('Error fetching user:', error);
			} finally {
				setLoading(false);
			}
		};

		getUser();

		const {
			data: { subscription },
		} = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				const { data: profile } = await supabaseClient
					.from('profiles')
					.select('role, avatar_url')
					.eq('id', session.user.id)
					.single();

				if (profile) {
					setUser({
						id: session.user.id,
						email: session.user.email!,
						role: profile.role || 'client',
						avatar_url: profile.avatar_url,
					});
				}
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => {
			subscription.unsubscribe();
			setUser(null);
			setLoading(false);
		};
	}, [setUser, setLoading]);

	return { user, loading };
}
