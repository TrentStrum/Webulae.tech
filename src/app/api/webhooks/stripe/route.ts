import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { supabase } from '@/src/lib/supabase/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const body = await req.text();
		const signature = headers().get('stripe-signature')!;

		const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

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
		}

		return new NextResponse('Webhook processed', { status: 200 });
	} catch (error) {
		console.error('Webhook error:', error);
		return new NextResponse('Webhook error', { status: 400 });
	}
}

async function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
	const orgId = subscription.metadata.orgId;
	const status = subscription.status;
	const priceId = subscription.items.data[0].price.id;

	await supabase
		.from('organizations')
		.update({
			subscription_status: status,
			subscription_price_id: priceId,
			updated_at: new Date().toISOString(),
		})
		.eq('clerk_org_id', orgId);
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription): Promise<void> {
	const orgId = subscription.metadata.orgId;

	await supabase
		.from('organizations')
		.update({
			subscription_status: 'inactive',
			subscription_price_id: null,
			updated_at: new Date().toISOString(),
		})
		.eq('clerk_org_id', orgId);
}
