'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';

export function useAuthState() {
	return useQuery({
		queryKey: ['auth', 'user'],
		queryFn: async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error || !session?.user?.email) return null;

			const { data: profile, error: profileError } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', session.user.id)
				.single();

			if (profileError) throw profileError;
			return {
				...profile,
				email: session.user.email,
			};
		},
	});
}
