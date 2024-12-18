import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createServerClient } from '@/src/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2023-10-16',
});

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { planId, paymentMethodId } = await req.json();

		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get or create Stripe customer
		let { data: customer } = await supabase
			.from('customers')
			.select('stripe_customer_id')
			.eq('user_id', session.user.id)
			.single();

		if (!customer?.stripe_customer_id) {
			const { data: profile } = await supabase
				.from('profiles')
				.select('email')
				.eq('id', session.user.id)
				.single();

			const stripeCustomer = await stripe.customers.create({
				email: profile?.email || undefined,
				payment_method: paymentMethodId,
				invoice_settings: {
					default_payment_method: paymentMethodId,
				},
			});

			await supabase.from('customers').insert({
				user_id: session.user.id,
				stripe_customer_id: stripeCustomer.id,
			});

			customer = { stripe_customer_id: stripeCustomer.id };
		}

		// Create subscription
		const subscription = await stripe.subscriptions.create({
			customer: customer.stripe_customer_id,
			items: [{ price: planId }],
			payment_settings: {
				payment_method_types: ['card'],
				save_default_payment_method: 'on_subscription',
			},
			expand: ['latest_invoice.payment_intent'],
		});

		return NextResponse.json({ subscriptionId: subscription.id });
	} catch (error) {
		console.error('Error creating subscription:', error);
		return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
	}
}
