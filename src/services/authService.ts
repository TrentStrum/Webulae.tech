import { AuthDataAccess } from '@/src/dataAccess/authDataAccess';
import { sessionUtils } from '@/src/lib/auth/session';
import { tokenUtils } from '@/src/lib/auth/token';
import { supabase } from '@/src/lib/supabase';
import { logger } from '@/src/utils/logger';

import type { AuthUser } from '@/src/types/user.types';

export const authService = {
	// Session Management
	getSession: async () => {
		logger.info('Authentication successful');
		const session = await AuthDataAccess.getSession();
		logger.info('Session result:', session);
		return session;
	},

	getUserProfile: async (userId: string) => {
		logger.info('Getting user profile for ID:', userId);
		const profile = await AuthDataAccess.getUserProfile(userId);
		logger.info('Profile result:', profile);
		return profile;
	},

	// Authentication State
	onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
		logger.info('Setting up auth state listener');
		return AuthDataAccess.onAuthStateChange(callback);
	},

	// Authentication Actions
	login: async (email: string, password: string) => {
		logger.info('Attempting login');
		try {
			const response = await supabase?.auth.signInWithPassword({ email, password });
			if (!response) throw new Error('No response from auth service');

			if (response.error) {
				logger.error('Login failed:', response.error);
				throw response.error;
			}

			const { data } = response;
			if (data.session?.access_token) {
				tokenUtils.setToken(data.session.access_token);
				sessionUtils.startSession();
			}

			logger.info('Login successful');
			return response;
		} catch (error) {
			logger.error('Login failed:', error);
			throw error;
		}
	},

	logout: async () => {
		logger.info('Attempting logout');
		try {
			const response = await supabase?.auth.signOut();
			if (!response) throw new Error('No response from auth service');
			if (response.error) throw response.error;

			tokenUtils.removeToken();
			sessionUtils.endSession();
			logger.info('Logout complete');
			return { error: null };
		} catch (error) {
			logger.error('Logout failed:', error);
			throw error;
		}
	},

	// Password Management
	resetPassword: async (email: string) => {
		try {
			const response = await supabase?.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});
			if (!response) throw new Error('No response from auth service');
			if (response.error) throw response.error;
			return { success: true };
		} catch (error) {
			logger.error('Error resetting password:', error);
			return { success: false, error };
		}
	},

	updatePassword: async (newPassword: string) => {
		try {
			const response = await supabase?.auth.updateUser({
				password: newPassword,
			});
			if (!response) throw new Error('No response from auth service');
			if (response.error) throw response.error;
			return { success: true };
		} catch (error) {
			logger.error('Error updating password:', error);
			return { success: false, error };
		}
	},

	// Session Refresh
	refreshSession: async () => {
		try {
			const response = await supabase?.auth.refreshSession();
			if (!response) throw new Error('No response from auth service');
			const { data, error } = response;
			if (error) throw error;
			if (data.session?.access_token) {
				tokenUtils.setToken(data.session.access_token);
			}
			return { success: true, session: data.session };
		} catch (error) {
			logger.error('Error refreshing session:', error);
			return { success: false, error };
		}
	},
};
