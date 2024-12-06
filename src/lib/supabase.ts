import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '@/src/types/database.types';

let instance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!instance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase configuration. Please check your environment variables:\n' +
        '- NEXT_PUBLIC_SUPABASE_URL\n' +
        '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    }

    // Validate URL format
    try {
      new URL(supabaseUrl);
    } catch (error) {
      throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
    }

    instance = createClientComponentClient<Database>({
      supabaseUrl,
      supabaseKey,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
        global: {
          headers: {
            'x-client-info': 'webulae-app',
          },
        },
      },
    });
  }
  return instance;
}

export const supabase = getSupabaseClient();

export function setupAuthListener(callback: (event: string, session: any) => void) {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  } catch (error) {
    console.error('Failed to setup auth listener:', error);
    throw error;
  }
}

export function clearSupabaseInstance() {
  instance = null;
}