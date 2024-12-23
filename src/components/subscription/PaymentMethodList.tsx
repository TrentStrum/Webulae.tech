'use client';

import { CreditCard, Trash2 } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import { useSubscriptionPayment } from '@/src/hooks/subscription/use-subscription-payment';

import { Badge } from '../ui/badge';

import type { PaymentMethod } from '@/src/types/subscription.types';


interface Props {
	paymentMethods: PaymentMethod[];
}

export const PaymentMethodList = ({ paymentMethods }: Props): JSX.Element => {
	const { removePaymentMethod, setDefaultPaymentMethod } = useSubscriptionPayment();

	return (
		<div className="space-y-4">
			{paymentMethods.map((method) => (
				<div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
					<div className="flex items-center space-x-4">
						<CreditCard className="h-6 w-6 text-muted-foreground" />
						<div>
							<p className="font-medium">
								{method.brand.toUpperCase()} •••• {method.last4}
							</p>
							<p className="text-sm text-muted-foreground">
								Expires {method.expiryMonth}/{method.expiryYear}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						{!method.isDefault && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setDefaultPaymentMethod.mutate(method.id)}
							>
								Make Default
							</Button>
						)}
						{method.isDefault && <Badge variant="secondary">Default</Badge>}
						<Button
							variant="ghost"
							size="icon"
							className="text-destructive"
							onClick={() => removePaymentMethod.mutate(method.id)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			))}
			{paymentMethods.length === 0 && (
				<p className="text-center text-muted-foreground py-8">No payment methods added yet.</p>
			)}
		</div>
	);
};
