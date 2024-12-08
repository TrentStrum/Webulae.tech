import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '../types/database.types';

let instance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
	const timeout = new Promise<never>((_, reject) => {
		setTimeout(() => {
			reject(new Error(`Request timed out after ${timeoutMs}ms`));
		}, timeoutMs);
	});

	return Promise.race([promise, timeout]);
}

export function getSupabaseClient(): ReturnType<
	typeof createClientComponentClient<Database>
> | null {
	if (!instance) {
		instance = createClientComponentClient<Database>();
	}
	return instance;
}
