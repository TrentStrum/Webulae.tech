import { supabaseClient } from '../lib/supabaseClient';

import type { AuthUser } from '../types/authUser.types';

// Get the current session
export async function getSession() {
	const { data, error } = await supabaseClient.auth.getSession();
	if (error) throw new Error(error.message);
	return data.session;
}

// Fetch user profile from Supabase
export async function getUserProfile(
	userId: string,
): Promise<Pick<AuthUser, 'role' | 'avatar_url'> | null> {
	const { data: profile, error } = await supabaseClient
		.from('profiles')
		.select('role, avatar_url')
		.eq('id', userId)
		.single();

	if (error) throw new Error(error.message);
	if (!profile?.role) return null;
	return profile as Pick<AuthUser, 'role' | 'avatar_url'>;
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (session: any) => void) {
	return supabaseClient.auth.onAuthStateChange((_event, session) => callback(session));
}
