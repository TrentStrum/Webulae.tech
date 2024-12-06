import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/src/types';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const requestUrl = new URL(request.url);
		const code = requestUrl.searchParams.get('code');
		const next = requestUrl.searchParams.get('next') || '/';

		if (code) {
			const supabase = createRouteHandlerClient<Database>({ cookies });
			await supabase.auth.exchangeCodeForSession(code);
		}

		// Redirect to the requested page or home
		return NextResponse.redirect(new URL(next, requestUrl.origin));
	} catch (error) {
		console.error('Auth error:', error);
		return NextResponse.json({ error: 'Authentication error occurred' }, { status: 500 });
	}
}
