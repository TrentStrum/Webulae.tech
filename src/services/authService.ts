import { apiClient } from '@/src/lib/apiClient';
import { createClient } from '@/src/lib/supabase/client';

import type { AuthUser } from '@/src/types/user.types';
import type { Session } from '@supabase/supabase-js';

export const authService = {
	// Direct Supabase auth operations
	login: async (email: string, password: string) => {
		const supabase = createClient();
		return supabase.auth.signInWithPassword({ email, password });
	},

	logout: async () => {
		const supabase = createClient();
		return supabase.auth.signOut();
	},

	onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
		const supabase = createClient();
		return supabase.auth.onAuthStateChange(callback);
	},

	// API route operations
	getUserProfile: async (userId: string) => {
		return apiClient.get<AuthUser>(`/api/users/${userId}/profile`);
	},

	updateProfile: async (userId: string, data: Partial<AuthUser>) => {
		return apiClient.patch(`/api/users/${userId}/profile`, data);
	},
};
