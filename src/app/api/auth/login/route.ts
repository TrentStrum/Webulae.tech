import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/src/types/database.types';

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const { email, password } = await req.json();
		const supabase = createRouteHandlerClient<Database>({ cookies });

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 401 });
		}

		return NextResponse.json(
			{
				user: data.user,
				session: data.session,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
	}
}
