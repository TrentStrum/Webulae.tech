'use client';

import { LoadingSpinner } from '@/src/components/loading/LoadingSpinner';
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { useSubscription } from '@/src/hooks/useSubscription';

const plans = [
	{
		name: 'Basic',
		price: '$10',
		priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
		features: ['Up to 5 team members', 'Basic features', '24/7 support'],
	},
	{
		name: 'Pro',
		price: '$29',
		priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
		features: ['Up to 20 team members', 'Advanced features', 'Priority support'],
	},
	{
		name: 'Enterprise',
		price: '$99',
		priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
		features: ['Unlimited team members', 'Custom features', 'Dedicated support'],
	},
];

export default function BillingPage() {
	const { subscription, isLoading } = useSubscription();

	if (isLoading) return <LoadingSpinner />;

	const handleUpgrade = async (priceId: string) => {
		try {
			const response = await fetch('/api/stripe/create-checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ priceId }),
			});

			const { url } = await response.json();
			window.location.href = url;
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleManageBilling = async () => {
		try {
			const response = await fetch('/api/stripe/create-portal', {
				method: 'POST',
			});

			const { url } = await response.json();
			window.location.href = url;
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>

			{subscription && (
				<div className="mb-6">
					<h2 className="text-lg font-semibold">Current Plan: {subscription.plan}</h2>
					<Button onClick={handleManageBilling}>Manage Billing</Button>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{plans.map((plan) => (
					<Card key={plan.name}>
						<CardHeader>
							<CardTitle>{plan.name}</CardTitle>
							<div className="text-2xl font-bold">{plan.price}/month</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{plan.features.map((feature) => (
									<li key={feature}>{feature}</li>
								))}
							</ul>
							<Button
								className="mt-4 w-full"
								onClick={() => handleUpgrade(plan.priceId!)}
								disabled={subscription?.plan === plan.name}
							>
								{subscription?.plan === plan.name ? 'Current Plan' : 'Upgrade'}
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
