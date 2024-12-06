import { getSupabaseClient } from '@/src/lib/supabase';

import type { Database } from '@/src/types/database.types';
import type {
	Subscription,
	PaymentMethod,
	SubscriptionStatus,
} from '@/src/types/subscription.types';

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];

function getClient() {
	const client = getSupabaseClient();
	if (!client) throw new Error('Supabase client not initialized');
	return client;
}

export async function getSubscriptionData(userId: string): Promise<Subscription> {
	const supabase = getClient();
	const { data, error } = await supabase
		.from('subscriptions')
		.select('*, payment_methods(*)')
		.eq('user_id', userId)
		.single();

	if (error) throw error;
	if (!data) throw new Error('Subscription not found');

	const subscription = data as SubscriptionRow;
	return {
		id: subscription.id,
		userId: subscription.user_id,
		planId: subscription.plan_id,
		planName: subscription.plan_name,
		status: subscription.status as SubscriptionStatus,
		nextBillingDate: subscription.next_billing_date,
		projectsUsed: subscription.projects_used,
		projectsLimit: subscription.projects_limit,
		storageUsed: subscription.storage_used,
		storageLimit: subscription.storage_limit,
		apiCallsUsed: subscription.api_calls_used,
		apiCallsLimit: subscription.api_calls_limit,
		paymentMethods: subscription.payment_methods as PaymentMethod[],
		currentPeriodStart: subscription.current_period_start,
		currentPeriodEnd: subscription.current_period_end,
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
		stripeSubscriptionId: subscription.stripe_subscription_id,
		stripeCustomerId: subscription.stripe_customer_id,
		createdAt: subscription.created_at,
		updatedAt: subscription.updated_at,
	};
}

export async function handleCancelAutoRenew(userId: string): Promise<void> {
	const supabase = getClient();
	const { error } = await supabase
		.from('subscriptions')
		.update({ cancel_at_period_end: true })
		.eq('user_id', userId);

	if (error) throw error;
}

export async function handleUpdatePlan(_userId: string): Promise<void> {
	throw new Error('Plan updates must be handled through the payment provider');
}

export async function handleDeletePaymentMethod(methodId: string): Promise<void> {
	const supabase = getClient();
	const { error } = await supabase.from('payment_methods').delete().eq('id', methodId);

	if (error) throw error;
}

export async function handleAddPaymentMethod(): Promise<void> {
	throw new Error('Payment method management must be handled through the payment provider');
}
