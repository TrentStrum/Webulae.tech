import {
	createServerComponentClient,
	createRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import type { Database } from '@/src/types/database.types';

type ServerClient = ReturnType<typeof createServerComponentClient<Database>>;
type RouteClient = ReturnType<typeof createRouteHandlerClient<Database>>;

export function createServerClient(): ServerClient {
	return createServerComponentClient<Database>({ cookies });
}

export function createRouteClient(): RouteClient {
	return createRouteHandlerClient<Database>({ cookies });
}

export const supabase = createServerClient();
