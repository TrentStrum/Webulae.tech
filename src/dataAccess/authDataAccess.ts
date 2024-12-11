import { createServerClient } from '../lib/supabase/server';

import type { AuthUser } from '../types/authUser.types';
import type { AuthChangeEvent, AuthResponse, Session } from '@supabase/supabase-js';

let currentAuthListener: { unsubscribe: () => void } | null = null;

export const AuthDataAccess = {
	getSession: async (): Promise<Session | null> => {
		// eslint-disable-next-line no-console
		console.log('📡 AuthDataAccess: Fetching session');
		const {
			data: { session },
			error,
		} = await createServerClient().auth.getSession();
		if (error) throw error;
		return session;
	},

	getUserProfile: async (userId: string): Promise<AuthUser> => {
		// eslint-disable-next-line no-console
		console.log('📡 AuthDataAccess: Fetching user data for ID:', userId);
		const [
			{ data: profile, error },
			{
				data: { session },
			},
		] = await Promise.all([
			createServerClient().from('profiles').select('*').eq('id', userId).single(),
			createServerClient().auth.getSession(),
		]);

		if (error) throw error;

		return {
			id: profile.id,
			email: session?.user?.email ?? '',
			role: profile.role ?? 'client',
		} as AuthUser;
	},

	onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
		// eslint-disable-next-line no-console
		console.log('👂 AuthDataAccess: Setting up auth state listener');

		if (currentAuthListener) {
			currentAuthListener.unsubscribe();
		}

		const {
			data: { subscription },
		} = createServerClient().auth.onAuthStateChange(
			async (event: AuthChangeEvent, session: Session | null) => {
				// eslint-disable-next-line no-console
				console.log('🔄 AuthDataAccess: Auth state changed:', event);

				if (session?.user) {
					const profile = await AuthDataAccess.getUserProfile(session.user.id);
					callback(profile);
				} else {
					callback(null);
				}
			}
		);

		currentAuthListener = subscription;
		return { data: { subscription } };
	},

	login: async (email: string, password: string): Promise<AuthResponse> => {
		return await createServerClient().auth.signInWithPassword({
			email,
			password,
		});
	},

	logout: async () => {
		return await createServerClient().auth.signOut();
	},
};
