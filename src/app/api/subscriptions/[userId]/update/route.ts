import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

import type { RouteContext } from '@/src/types/route.types';

export async function POST(
	req: Request,
	{ params }: RouteContext<{ userId: string }>
): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { planId } = await req.json();
		if (!planId) {
			return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
		}

		const { error } = await supabase
			.from('subscriptions')
			.update({ 
				plan_id: planId,
				updated_at: new Date().toISOString()
			})
			.eq('user_id', params.userId);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ message: 'Subscription updated successfully' });
	} catch (error) {
		console.error('Error updating subscription:', error);
		return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
	}
} 