import { supabaseClient } from '../lib/supabaseClient';

import type { AuthUser } from '../types/user.types';
import type { Session } from '@supabase/supabase-js';

// Get the current session
export async function getSession(): Promise<Session | null> {
	const { data, error } = await supabaseClient.auth.getSession();
	if (error) throw new Error(error.message);
	return data.session;
}

type ProfileResponse = {
	role: AuthUser['role'];
	avatar_url: string | null;
};

// Fetch user profile from Supabase
export async function getUserProfile(userId: string): Promise<ProfileResponse | null> {
	const { data, error } = await supabaseClient
		.from('profiles')
		.select('role, avatar_url')
		.eq('id', userId)
		.single<ProfileResponse>();

	if (error || !data) return null;
	return data;
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (session: Session | null) => void): () => void {
	const {
		data: { subscription },
	} = supabaseClient.auth.onAuthStateChange((_event, session) => callback(session));
	return () => subscription.unsubscribe();
}
