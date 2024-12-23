import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { createServerClient } from './server';

import type { Database } from '@/src/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type TypedSupabaseClient = SupabaseClient<Database>;

// Create a centralized client configuration
export const createTypedClient = (type: 'server' | 'client'): TypedSupabaseClient => {
	const client = type === 'server' ? createServerClient() : createClientComponentClient();
	if (!client) throw new Error('Could not initialize Supabase client');
	return client;
};

// Export a singleton instance for client-side usage
export const supabaseClient = createTypedClient('client');
