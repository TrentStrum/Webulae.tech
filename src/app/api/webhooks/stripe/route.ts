import { clerkClient } from '@clerk/nextjs';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { sendBillingNotification } from '@/src/lib/email/send-email';
import { supabase } from '@/src/lib/supabase';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request): Promise<NextResponse> {
	const body = await req.text();
	const signature = headers().get('stripe-signature')!;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (error) {
		return NextResponse.json(
			{ error: `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
			{ status: 400 }
		);
	}

	try {
		switch (event.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated': {
				const subscription = event.data.object as Stripe.Subscription;
				const orgId = subscription.metadata.organizationId;

				if (!orgId) {
					throw new Error('No organization ID in subscription metadata');
				}

				const org = await clerkClient.organizations.getOrganization({ organizationId: orgId });
				const members = await clerkClient.organizations.getOrganizationMembershipList({
					organizationId: orgId,
				});

				const adminMembers = members.filter(member => member.role === 'admin');

				// Update organization subscription status
				await clerkClient.organizations.updateOrganization(orgId, {
					privateMetadata: {
							subscriptionId: subscription.id,
							planId: subscription.items.data[0].price.id,
							status: subscription.status,
					},
				});

				// Send notification to all admin members
				for (const member of adminMembers) {
					if (!member.publicUserData?.userId) continue;
					
					const user = await clerkClient.users.getUser(member.publicUserData.userId);
					const email = user.emailAddresses[0]?.emailAddress;
					
					if (email) {
						await sendBillingNotification({
							organizationId: orgId,
							to: email,
							organizationName: org.name,
							eventType: 'subscription.updated',
							details: {
								planName: subscription.items.data[0].price.nickname || 'Unknown Plan',
								date: new Date(),
							},
						});
					}
				}

				// Log the event
				await supabase.from('audit_log').insert([{
					organization_id: orgId,
					event: 'billing.subscription.updated',
					actor: 'system',
					description: `Subscription ${subscription.status}`,
					metadata: {
						subscriptionId: subscription.id,
						planId: subscription.items.data[0].price.id,
						status: subscription.status,
					}
				}]);

				break;
			}

			case 'invoice.payment_succeeded': {
				const invoice = event.data.object as Stripe.Invoice;
				const orgId = invoice.metadata?.organizationId;

				if (!orgId) {
					throw new Error('No organization ID in invoice metadata');
				}

				const org = await clerkClient.organizations.getOrganization({ organizationId: orgId });
				const members = await clerkClient.organizations.getOrganizationMembershipList({
					organizationId: orgId,
				});

				const adminMembers = members.filter(member => member.role === 'admin');

				// Send notification to all admin members
				for (const member of adminMembers) {
					if (!member.publicUserData?.userId) continue;
					
					const user = await clerkClient.users.getUser(member.publicUserData.userId);
					const email = user.emailAddresses[0]?.emailAddress;
					
					if (email) {
						await sendBillingNotification({
							organizationId: orgId,
							to: email,
							organizationName: org.name,
							eventType: 'payment.success',
							details: {
								amount: invoice.total / 100,
									invoiceUrl: invoice.hosted_invoice_url || undefined,
								date: new Date(invoice.created * 1000),
							},
						});
					}
				}

				// Log the successful payment
				await supabase.from('audit_log').insert([{
					organization_id: orgId,
					event: 'billing.payment.succeeded',
					actor: 'system',
					description: `Payment succeeded for invoice ${invoice.number}`,
					metadata: {
						invoiceId: invoice.id,
						amount: invoice.total,
						status: invoice.status,
					}
				}]);

				break;
			}

			case 'invoice.payment_failed': {
				const invoice = event.data.object as Stripe.Invoice;
				const orgId = invoice.metadata?.organizationId;

				if (!orgId) {
					throw new Error('No organization ID in invoice metadata');
				}

				const org = await clerkClient.organizations.getOrganization({ organizationId: orgId });
				const members = await clerkClient.organizations.getOrganizationMembershipList({
					organizationId: orgId,
				});

				const adminMembers = members.filter(member => member.role === 'admin');

				// Send notification to all admin members
				for (const member of adminMembers) {
					if (!member.publicUserData?.userId) continue;
					
					const user = await clerkClient.users.getUser(member.publicUserData.userId);
					const email = user.emailAddresses[0]?.emailAddress;
					
					if (email) {
							await sendBillingNotification({
								organizationId: orgId,
								to: email,
								organizationName: org.name,
								eventType: 'payment.failed',
								details: {
									amount: invoice.total / 100,
									invoiceUrl: invoice.hosted_invoice_url || undefined,
									date: new Date(invoice.created * 1000),
								},
							});
					}
				}

				// Log the failed payment
				await supabase.from('audit_log').insert([{
					organization_id: orgId,
					event: 'billing.payment.failed',
					actor: 'system',
					description: `Payment failed for invoice ${invoice.number}`,
					metadata: {
							invoiceId: invoice.id,
							amount: invoice.total,
						status: invoice.status,
					}
				}]);

				break;
			}
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return NextResponse.json(
			{ error: `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
			{ status: 500 }
		);
	}
}
