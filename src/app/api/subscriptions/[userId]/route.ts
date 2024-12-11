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

		const { data: subscription, error } = await supabase
			.from('subscriptions')
			.select('*, payment_methods(*)')
			.eq('user_id', params.userId)
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!subscription) {
			return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
		}

		return NextResponse.json(subscription);
	} catch (error) {
		console.error('Error fetching subscription:', error);
		return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
	}
}
