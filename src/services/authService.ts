import { AuthDataAccess } from '@/src/dataAccess/authDataAccess';
import { AuthUser } from '@/src/types/authUser.types';
import { supabase } from '../lib/supabase';

export const authService = {
	getSession: async () => {
		console.log('🔐 authService: Getting session');
		const session = await AuthDataAccess.getSession();
		console.log('📦 authService: Session result:', session);
		return session;
	},

	getUserProfile: async (userId: string) => {
		console.log('👤 authService: Getting user profile for ID:', userId);
		const profile = await AuthDataAccess.getUserProfile(userId);
		console.log('📋 authService: Profile result:', profile);
		return profile;
	},

	onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
		console.log('👂 authService: Setting up auth state listener');
		return AuthDataAccess.onAuthStateChange(callback);
	},

	login: async (email: string, password: string) => {
		console.log('🔐 authService: Attempting login');
		const response = await supabase.auth.signInWithPassword({ email, password });
		console.log('✅ authService: Login successful');
		return response;
	},

	logout: async () => {
		console.log('🔐 authService: Attempting logout');
		try {
			const { error } = await supabase.auth.signOut();
			console.log('✅ authService: Logout complete');
			return { error };
		} catch (error) {
			console.error('❌ authService: Logout failed:', error);
			throw error;
		}
	},
};
