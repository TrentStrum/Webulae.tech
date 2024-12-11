import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import type { Database } from '@/src/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// For server-side usage
export function createServerClient(): SupabaseClient<Database> {
	return createServerComponentClient<Database>({ cookies });
}

export const supabase = createServerClient();
