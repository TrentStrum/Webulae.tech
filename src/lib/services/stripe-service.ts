import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2023-10-16',
});

export class StripeService {
	static async createCustomer(organizationId: string, email: string, name: string): Promise<Stripe.Customer> {
		return stripe.customers.create({
			email,
			name,
			metadata: {
				organizationId,
			},
		});
	}

	static async createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription> {
		return stripe.subscriptions.create({
			customer: customerId,
			items: [{ price: priceId }],
			payment_behavior: 'default_incomplete',
			payment_settings: {
				save_default_payment_method: 'on_subscription',
			},
			expand: ['latest_invoice.payment_intent'],
		});
	}

	static async createBillingPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
		return stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: returnUrl,
		});
	}
}
