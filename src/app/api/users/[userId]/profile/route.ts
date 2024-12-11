import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

import type { RouteContext } from '@/src/types/route.types';

export async function GET(
	_: Request,
	{ params }: RouteContext<{ userId: string }>
): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: profile, error } = await supabase
			.from('profiles')
			.select('id, role, avatar_url, email, username, full_name')
			.eq('id', params.userId)
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!profile) {
			return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
		}

		return NextResponse.json(profile);
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: RouteContext<{ userId: string }>
): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const updates = await req.json();

		const { data: profile, error } = await supabase
			.from('profiles')
			.update(updates)
			.eq('id', params.userId)
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(profile);
	} catch (error) {
		console.error('Error updating user profile:', error);
		return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
	}
}
