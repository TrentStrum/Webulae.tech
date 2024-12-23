import { useMutation } from '@tanstack/react-query';

import type { PaymentMethod } from '@/src/types/subscription.types';
import type { UseMutationResult } from '@tanstack/react-query';
    
interface SubscriptionPaymentAPI {
	removePaymentMethod: UseMutationResult<PaymentMethod, Error, string>;
	setDefaultPaymentMethod: UseMutationResult<PaymentMethod, Error, string>;
}

export function useSubscriptionPayment(): SubscriptionPaymentAPI {
	const removePaymentMethod = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`/api/subscription/payment-methods/${id}`, {
				method: 'DELETE',
			});
			return response.json();
		},
	});

	const setDefaultPaymentMethod = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`/api/subscription/payment-methods/${id}/default`, {
				method: 'POST',
			});
			return response.json();
		},
	});

	return { removePaymentMethod, setDefaultPaymentMethod };
} 