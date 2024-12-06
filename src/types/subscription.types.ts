export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due' | 'pending';

export type SubscriptionPlan = {
	id: string;
	name: string;
	description: string;
	price: number;
	interval: 'month' | 'year';
	features: string[];
	stripePriceId: string;
};

export interface PaymentMethod {
	id: string;
	isDefault: boolean;
	// Add other payment method fields
}

export type Subscription = {
	nextBillingDate: string | number | Date;
	projectsUsed: number;
	projectsLimit: number;
	storageUsed: number;
	storageLimit: number;
	apiCallsUsed: number;
	apiCallsLimit: number;
	paymentMethods: PaymentMethod[];
	id: string;
	userId: string;
	planId: string;
	planName: string;
	status: SubscriptionStatus;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	cancelAtPeriodEnd: boolean;
	stripeSubscriptionId: string;
	stripeCustomerId: string;
	createdAt: string;
	updatedAt: string;
};

export type SubscriptionEvent = {
	id: string;
	subscriptionId: string;
	type: 'created' | 'renewed' | 'canceled' | 'updated' | 'payment_failed';
	data: Record<string, any>;
	createdAt: string;
};

export type SubscriptionError = {
	code: string;
	message: string;
	details?: Record<string, any>;
};
