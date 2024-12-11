import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '@/src/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// For client-side usage
export function createClient(): SupabaseClient<Database> {
	return createClientComponentClient<Database>();
}

export const supabaseClient = createClient();
