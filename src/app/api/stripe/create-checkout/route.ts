import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { StripeService } from '@/src/lib/services/stripe-service';
import { supabase } from '@/src/lib/supabase/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const { userId, orgId } = await auth();
		const { priceId } = await req.json();

		if (!userId || !orgId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// Get organization from database
		const { data: org } = await supabase
			.from('organizations')
			.select('stripe_customer_id')
			.eq('clerk_org_id', orgId)
			.single();

		let customerId = org?.stripe_customer_id;

		// If no customer ID exists, create one
		if (!customerId) {
			const org = await clerkClient.organizations.getOrganization({ organizationId: orgId });
			const customer = await StripeService.createCustomer(
				orgId,
				org.slug ?? 'no-slug',
				org.name ?? 'Organization'
			);
			customerId = customer.id;

			// Save customer ID to database
			await supabase
				.from('organizations')
				.update({ stripe_customer_id: customerId })
				.eq('clerk_org_id', orgId);
		}

		// Create Stripe Checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			line_items: [{ price: priceId, quantity: 1 }],
			mode: 'subscription',
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/organization/billing?success=true`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/organization/billing?canceled=true`,
			metadata: {
				orgId,
			},
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error('Error:', error);
		return new NextResponse('Error creating checkout session', { status: 500 });
	}
}
