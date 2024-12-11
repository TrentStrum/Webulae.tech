import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '@/src/types/database.types';

type ClientType = ReturnType<typeof createClientComponentClient<Database>>;

export function createClient(): ClientType {
	return createClientComponentClient<Database>();
}

export const supabaseClient = createClient();
