import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { supabase } from '@/src/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2023-10-16',
});

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const { priceId } = await req.json();
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { data: subscription } = await supabase
			.from('subscriptions')
			.select('stripeSubscriptionId')
			.eq('userId', session.user.id)
			.single();

		if (!subscription) {
			return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
		}

		const updatedSubscription = await stripe.subscriptions.update(
			subscription.stripeSubscriptionId,
			{
				items: [{ price: priceId }],
				proration_behavior: 'always_invoice',
			}
		);

		return NextResponse.json({
			subscriptionId: updatedSubscription.id,
			status: updatedSubscription.status,
		});
	} catch (error) {
		console.error('Error updating subscription:', error);
		return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
	}
}
