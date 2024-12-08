import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/src/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function createServerSupabase(): SupabaseClient<Database> {
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}

export const supabase = createServerSupabase();
