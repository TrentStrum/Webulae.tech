'use client';

import { CreditCard, Check } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/src/components/ui/dialog';
import { useToast } from '@/src/hooks/helpers/use-toast';

const plans = [
	{
		name: 'Free',
		description: 'For small teams getting started',
		price: '$0',
		features: ['Up to 5 team members', 'Basic features', '1GB storage'],
		current: true,
	},
	{
		name: 'Pro',
		description: 'For growing teams and organizations',
		price: '$29',
		features: ['Unlimited team members', 'Advanced features', '10GB storage', 'Priority support'],
		current: false,
	},
	{
		name: 'Enterprise',
		description: 'For large organizations with custom needs',
		price: 'Custom',
		features: [
			'Custom team size',
			'All features',
			'Unlimited storage',
			'24/7 support',
			'Custom integrations',
		],
		current: false,
	},
];

export function OrganizationBilling(): JSX.Element {
	const { toast } = useToast();
	const [showBillingPortal, setShowBillingPortal] = useState(false);

	const handleUpgrade = async (planName: string): Promise<void> => {
		try {
			// Integration with your billing provider (e.g., Stripe) would go here
			toast({
				title: 'Upgrading plan',
				description: `Starting upgrade process to ${planName} plan.`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to initiate plan upgrade.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Billing & Plans</h3>
				<p className="text-sm text-muted-foreground">
					Manage your subscription and billing information.
				</p>
			</div>

			{/* Current Plan Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCard className="h-5 w-5" />
						Current Plan
					</CardTitle>
					<CardDescription>
						Your organization is currently on the {plans[0].name} plan.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<Badge variant="secondary">
							{plans[0].name}
						</Badge>
						<span className="text-2xl font-bold">{plans[0].price}</span>
						<span className="text-muted-foreground">/month</span>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						variant="outline"
						onClick={() => setShowBillingPortal(true)}
					>
						Manage Billing
					</Button>
				</CardFooter>
			</Card>

			{/* Available Plans */}
			<div className="grid gap-4 md:grid-cols-3">
				{plans.map((plan) => (
					<Card key={plan.name}>
						<CardHeader>
							<CardTitle>{plan.name}</CardTitle>
							<CardDescription>{plan.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-4">
								<span className="text-3xl font-bold">{plan.price}</span>
								{plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
							</div>
							<ul className="space-y-2">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">{feature}</span>
									</li>
								))}
							</ul>
						</CardContent>
						<CardFooter>
							<Button
								className="w-full"
								variant={plan.current ? 'secondary' : 'default'}
								disabled={plan.current}
								onClick={() => handleUpgrade(plan.name)}
							>
								{plan.current ? 'Current Plan' : 'Upgrade'}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			{/* Billing Portal Dialog */}
			<Dialog open={showBillingPortal} onOpenChange={setShowBillingPortal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Billing Portal</DialogTitle>
						<DialogDescription>
							Manage your billing information and subscription details.
						</DialogDescription>
					</DialogHeader>
					{/* Billing portal content would go here */}
				</DialogContent>
			</Dialog>
		</div>
	);
} 