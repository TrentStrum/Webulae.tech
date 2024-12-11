import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

import type { RouteContext } from '@/src/types/route.types';

export async function POST(
	_: Request,
	{ params }: RouteContext<{ userId: string }>
): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { error } = await supabase
			.from('subscriptions')
			.update({ cancel_at_period_end: true })
			.eq('user_id', params.userId);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ message: 'Subscription cancelled successfully' });
	} catch (error) {
		console.error('Error cancelling subscription:', error);
		return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
	}
} 