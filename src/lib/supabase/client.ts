import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { SupabaseDatabase } from './config';
import type { SupabaseClient } from '@supabase/supabase-js';


export type SupabaseClientType = SupabaseClient<SupabaseDatabase>;

// Create a typed client for component use
export function createClient(): SupabaseClientType {
	return createClientComponentClient<SupabaseDatabase>();
}

// Export a singleton instance for client-side usage
export const supabaseClient = createClient();
