'use client';

import { PaymentMethod } from '@/src/types/subscription.types';
import { Button } from '@/src/components/ui/button';
import { CreditCard, Trash2 } from 'lucide-react';
import { useSubscriptionPayment } from '@/src/hooks/subscription/useSubscriptionPayment';

interface Props {
  paymentMethods: PaymentMethod[];
}

export function PaymentMethodList({ paymentMethods }: Props) {
  const { removePaymentMethod, setDefaultPaymentMethod } = useSubscriptionPayment('');

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {method.card.brand.toUpperCase()} •••• {method.card.last4}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires {method.card.expMonth}/{method.card.expYear}
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
            {method.isDefault && (
              <Badge variant="secondary">Default</Badge>
            )}
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
        <p className="text-center text-muted-foreground py-8">
          No payment methods added yet.
        </p>
      )}
    </div>
  );
}