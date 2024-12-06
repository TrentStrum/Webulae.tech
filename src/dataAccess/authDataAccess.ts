import { supabase } from '@/src/lib/supabase';

import type { AuthUser } from '@/src/types/authUser.types';

let currentAuthListener: { unsubscribe: () => void } | null = null;

export const AuthDataAccess = {
	getSession: async () => {
		console.log('📡 AuthDataAccess: Fetching session');
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();
		if (error) throw error;
		return session;
	},

	getUserProfile: async (userId: string) => {
		console.log('📡 AuthDataAccess: Fetching user data for ID:', userId);
		const [
			{ data: profile, error },
			{
				data: { session },
			},
		] = await Promise.all([
			supabase.from('profiles').select('*').eq('id', userId).single(),
			supabase.auth.getSession(),
		]);

		if (error) throw error;

		return {
			id: profile.id,
			email: session?.user?.email ?? '',
			role: profile.role ?? 'client',
			avatar_url: profile.avatar_url,
		} as AuthUser;
	},

	onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
		console.log('👂 AuthDataAccess: Setting up auth state listener');

		if (currentAuthListener) {
			currentAuthListener.unsubscribe();
		}

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log('🔄 AuthDataAccess: Auth state changed:', event);

			if (session?.user) {
				const profile = await AuthDataAccess.getUserProfile(session.user.id);
				callback(profile);
			} else {
				callback(null);
			}
		});

		currentAuthListener = subscription;
		return { data: { subscription } };
	},

	login: async (email: string, password: string) => {
		return await supabase.auth.signInWithPassword({
			email,
			password,
		});
	},

	logout: async () => {
		return await supabase.auth.signOut();
	},
};
