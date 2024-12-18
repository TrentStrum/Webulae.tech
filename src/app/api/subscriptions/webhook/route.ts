import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createServerClient } from '@/src/lib/supabase/server';

import type { SubscriptionStatus } from '@/src/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const body = await req.text();
		const signature = headers().get('stripe-signature')!;

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
		} catch (err) {
			console.error('Webhook signature verification failed:', err);
			return new NextResponse('Webhook signature verification failed', { status: 400 });
		}

		switch (event.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
				const subscription = event.data.object as Stripe.Subscription;
				await handleSubscriptionChange(subscription);
				break;

			case 'customer.subscription.deleted':
				const deletedSubscription = event.data.object as Stripe.Subscription;
				await handleSubscriptionDeletion(deletedSubscription);
				break;

			case 'invoice.payment_failed':
				const invoice = event.data.object as Stripe.Invoice;
				await handleFailedPayment(invoice);
				break;
		}

		return new NextResponse(null, { status: 200 });
	} catch (err) {
		console.error('Error processing webhook:', err);
		return new NextResponse('Webhook error', { status: 500 });
	}
}

async function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
	const supabase = createServerClient();
	if (!supabase) throw new Error('Could not initialize Supabase client');

	const customerId = subscription.customer as string;
	const status = subscription.status;
	const subscriptionId = subscription.id;

	const { data: customer } = await supabase
		.from('profiles')
		.select('id')
		.eq('stripe_customer_id', customerId)
		.single();

	if (!customer) {
		throw new Error('Customer not found');
	}

	await supabase.from('subscriptions').upsert({
		id: subscriptionId,
		user_id: customer.id,
		status: mapStripeStatus(status),
		plan_id: subscription.items.data[0].price.id,
		plan_name: subscription.items.data[0].price.nickname || 'Default Plan',
		current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
		current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
		cancel_at_period_end: subscription.cancel_at_period_end,
		payment_methods: [],
		projects_used: 0,
		projects_limit: 5,
		storage_used: 0,
		storage_limit: 1000,
		api_calls_used: 0,
		api_calls_limit: 1000,
		stripe_customer_id: customerId,
	});

	await supabase.from('subscription_events').insert({
		subscription_id: subscriptionId,
		type: subscription.status === 'active' ? 'created' : 'updated',
		data: {
			status: subscription.status,
			cancel_at_period_end: subscription.cancel_at_period_end,
		},
	});
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription): Promise<void> {
	const supabase = createServerClient();
	if (!supabase) throw new Error('Could not initialize Supabase client');

	await supabase
		.from('subscriptions')
		.update({ status: 'canceled' })
		.eq('stripe_subscription_id', subscription.id);

	await supabase.from('subscription_events').insert({
		subscription_id: subscription.id,
		type: 'canceled',
		data: {
			canceled_at: new Date().toISOString(),
		},
	});
}

async function handleFailedPayment(invoice: Stripe.Invoice): Promise<void> {
	const supabase = createServerClient();
	if (!supabase) throw new Error('Could not initialize Supabase client');

	const subscriptionId = invoice.subscription as string;

	await supabase
		.from('subscriptions')
		.update({ status: 'past_due' })
		.eq('stripe_subscription_id', subscriptionId);

	await supabase.from('subscription_events').insert({
		subscription_id: subscriptionId,
		type: 'payment_failed',
		data: {
			invoice_id: invoice.id,
			amount_due: invoice.amount_due,
			next_payment_attempt: invoice.next_payment_attempt,
		},
	});
}

// Helper function to map Stripe status to our enum
function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
	const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
		active: 'active',
		past_due: 'past_due',
		canceled: 'canceled',
		incomplete: 'pending',
		incomplete_expired: 'canceled',
		trialing: 'trial',
		unpaid: 'past_due',
		paused: 'paused',
	};
	return statusMap[stripeStatus];
}
