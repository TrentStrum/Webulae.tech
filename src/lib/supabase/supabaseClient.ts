// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance of the Supabase client
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: false, // Do not persist sessions on the server
	},
});
