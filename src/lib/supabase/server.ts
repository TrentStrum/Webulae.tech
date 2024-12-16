import {
	createServerComponentClient,
	createRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import type { SupabaseDatabase } from './config';

// Type definitions for different server contexts
export type SupabaseServerClient = ReturnType<typeof createServerComponentClient<SupabaseDatabase>>;
export type SupabaseRouteClient = ReturnType<typeof createRouteHandlerClient<SupabaseDatabase>>;

// Create a typed client for server components
export function createServerClient(): SupabaseServerClient {
	return createServerComponentClient<SupabaseDatabase>({ cookies });
}

// Create a typed client for API routes
export function createRouteClient(): SupabaseRouteClient {
	return createRouteHandlerClient<SupabaseDatabase>({ cookies });
}

// Export a singleton instance for server-side usage
export const supabaseServer = createServerClient();
