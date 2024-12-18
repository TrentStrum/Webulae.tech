import { createClient } from '@supabase/supabase-js';

import type { SupabaseDatabase } from './config';

// Type definition for our Supabase client
export type SupabaseServerClient = ReturnType<typeof createClient<SupabaseDatabase>>;

// Create a typed Supabase client for server-side operations
export function createServerClient(): SupabaseServerClient {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !supabaseServiceKey) {
		throw new Error('Missing Supabase environment variables');
	}

	return createClient<SupabaseDatabase>(supabaseUrl, supabaseServiceKey);
}

// Export a singleton instance for server-side usage
export const supabase = createServerClient();

// Helper function to get the current user's ID from Clerk
export function getCurrentUserId(): string | null {
	const { userId } = auth();
	return userId;
}

// Helper function to perform authenticated database operations
export async function withUser<T>(
	operation: (userId: string) => Promise<T>
): Promise<T> {
	const userId = getCurrentUserId();
	
	if (!userId) {
		throw new Error('Unauthorized: No user found');
	}

	return operation(userId);
}
