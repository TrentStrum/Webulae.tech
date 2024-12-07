import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '@/src/types';

let instance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export function getSupabaseClient(): ReturnType<
	typeof createClientComponentClient<Database>
> | null {
	if (!instance) {
		instance = createClientComponentClient<Database>();
	}
	return instance;
}

// Use this in your API routes
export function getSupabase(): ReturnType<typeof createClientComponentClient<Database>> {
	const supabase = getSupabaseClient();
	if (!supabase) throw new Error('Supabase client not initialized');
	return supabase;
}

export function setupAuthListener(callback: (event: string, session: any) => void): () => void {
	try {
		const {
			data: { subscription },
		} = getSupabase().auth.onAuthStateChange(callback);
		return () => subscription.unsubscribe();
	} catch (error) {
		console.error('Failed to setup auth listener:', error);
		throw error;
	}
}

export function clearSupabaseInstance(): void {
	instance = null;
}
