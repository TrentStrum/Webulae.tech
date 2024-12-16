'use client';

import { useEffect, useState } from 'react';

import { supabaseClient } from '@/src/lib/supabase';

import type { DatabaseProfile } from '@/src/types/user.types';



export function useAuth(): { user: DatabaseProfile | null; loading: boolean } {
	const [user, setUser] = useState<DatabaseProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const { data } = supabaseClient.auth.onAuthStateChange(async (_, session) => {
			if (session?.user) {
				const { data } = await supabaseClient
					.from('profiles')
					.select('*')
					.eq('id', session.user.id)
					.single();
				setUser(data);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => data.subscription.unsubscribe();
	}, []);

	return { user, loading };
}
