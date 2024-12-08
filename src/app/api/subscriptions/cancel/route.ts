import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { supabase } from '@/src/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2023-10-16',
});

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const { subscriptionId, atPeriodEnd = true } = await req.json();

		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Verify subscription belongs to user
		const { data: subscription } = await supabase
			.from('subscriptions')
			.select('stripe_subscription_id')
			.eq('user_id', session.user.id)
			.eq('stripe_subscription_id', subscriptionId)
			.single();

		if (!subscription) {
			return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
		}

		// Cancel subscription
		await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: atPeriodEnd,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error canceling subscription:', error);
		return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
	}
}
