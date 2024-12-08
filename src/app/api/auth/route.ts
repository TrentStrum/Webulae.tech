import { NextResponse } from 'next/server';

import { supabase } from '@/src/lib/supabase/server';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const requestUrl = new URL(request.url);
		const code = requestUrl.searchParams.get('code');
		const next = requestUrl.searchParams.get('next') || '/';

		if (code) {
			await supabase.auth.exchangeCodeForSession(code);
		}

		// Redirect to the requested page or home
		return NextResponse.redirect(new URL(next, requestUrl.origin));
	} catch (error) {
		console.error('Auth error:', error);
		return NextResponse.json({ error: 'Authentication error occurred' }, { status: 500 });
	}
}

export const dynamic = 'force-dynamic';
