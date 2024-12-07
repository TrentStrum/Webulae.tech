'use client';

import { formatDistanceToNow } from 'date-fns';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

import type { Subscription } from '@/src/types/subscription.types';

interface SubscriptionStatusProps {
	subscription: Subscription;
	onManage: () => void;
	onCancel: () => void;
}

export function SubscriptionStatus({ subscription, onManage, onCancel }: SubscriptionStatusProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-500/10 text-green-500';
			case 'canceled':
				return 'bg-red-500/10 text-red-500';
			case 'past_due':
				return 'bg-yellow-500/10 text-yellow-500';
			default:
				return 'bg-gray-500/10 text-gray-500';
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
				<Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<p className="text-sm font-medium text-muted-foreground">Current Period</p>
						<p className="text-lg">
							Renews{' '}
							{formatDistanceToNow(new Date(subscription.currentPeriodEnd), { addSuffix: true })}
						</p>
					</div>
					<div className="flex gap-4">
						<Button onClick={onManage} className="flex-1">
							Manage Subscription
						</Button>
						{!subscription.cancelAtPeriodEnd && (
							<Button variant="outline" onClick={onCancel} className="flex-1">
								Cancel
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
