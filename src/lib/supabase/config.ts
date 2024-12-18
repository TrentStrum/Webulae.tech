import type { Database } from '@/src/types/database.types';

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// Type exports for consistent typing across the application
export type SupabaseDatabase = Database; 