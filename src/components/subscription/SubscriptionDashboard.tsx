import React, { useState, useEffect } from 'react';

import { Button } from '@/src/components/ui/button';
import { subscriptionService } from '@/src/services/subscriptionService';

import { PaymentMethodCard } from '../billing/PaymentMethodCard';
import { UsageCard } from '../billing/UsageCard';

import type { Subscription, PaymentMethod } from '@/src/types/subscription.types';

export function SubscriptionDashboard({ userId }: { userId: string }) {
	const [subscription, setSubscription] = useState<Subscription | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		handleCancelAutoRenew,
		handleUpdatePlan,
		handleDeletePaymentMethod,
		handleAddPaymentMethod,
	} = subscriptionService;

	useEffect(() => {
		const fetchSubscriptionData = async () => {
			try {
				setLoading(true);
				const data = await subscriptionService.getSubscriptionData(userId);
				setSubscription(data);
			} catch (err) {
				setError('Failed to load subscription data');
			} finally {
				setLoading(false);
			}
		};

		fetchSubscriptionData();
	}, [userId]);

	const handlePlanUpdate = () => {
		const planId = 'selected-plan-id';
		handleUpdatePlan(userId, planId);
	};

	if (loading) return <div>Loading subscription details...</div>;
	if (error) return <div className="error">{error}</div>;
	if (!subscription) return <div>No active subscription found</div>;

	return (
		<div className="subscription-dashboard">
			<h2>Current Subscription</h2>

			{/* Plan Details */}
			<div className="plan-details">
				<h3>Plan: {subscription.planName}</h3>
				<p>Status: {subscription.status}</p>
				<p>Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
			</div>

			{/* Usage Metrics */}
			<div className="usage-metrics">
				<UsageCard
					title="Projects"
					used={subscription.projectsUsed}
					limit={subscription.projectsLimit}
				/>
				<UsageCard
					title="Storage"
					used={subscription.storageUsed}
					limit={subscription.storageLimit}
					unit="GB"
				/>
				<UsageCard
					title="API Calls"
					used={subscription.apiCallsUsed}
					limit={subscription.apiCallsLimit}
					unit="calls"
				/>
			</div>

			{/* Actions */}
			<div className="subscription-actions">
				<Button onClick={() => handleCancelAutoRenew(userId)} variant="secondary">
					Cancel Auto-renew
				</Button>
				<Button onClick={handlePlanUpdate} variant="default">
					Update Plan
				</Button>
			</div>

			{/* Payment Methods */}
			<div className="payment-methods">
				<h3>Payment Methods</h3>
				{subscription.paymentMethods.map((method: PaymentMethod) => (
					<PaymentMethodCard
						key={method.id}
						method={method}
						isDefault={method.isDefault}
						onDelete={() => handleDeletePaymentMethod(method.id)}
					/>
				))}
				<Button onClick={() => handleAddPaymentMethod(userId, 'new')} variant="outline">
					Add Payment Method
				</Button>
			</div>
		</div>
	);
}
