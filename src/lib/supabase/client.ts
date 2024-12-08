import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '@/src/types/supabase';

export function createClient(): ReturnType<typeof createClientComponentClient<Database>> {
	return createClientComponentClient<Database>();
}

export const supabaseClient = createClient();
