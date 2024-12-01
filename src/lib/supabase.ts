import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/src/types/database.types';

let instance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export function getSupabaseClient() {
    if (!instance) {
        instance = createClientComponentClient<Database>();
    }
    return instance;
}

export const supabase = getSupabaseClient();

export function setupAuthListener(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
	return () => subscription.unsubscribe();
}