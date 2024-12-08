'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { PaymentMethod, SubscriptionError } from '@/src/types/subscription.types';
import type { UseMutationResult } from '@tanstack/react-query';

type PaymentMethodResponse = {
	success: boolean;
	paymentMethod: PaymentMethod;
};

type UseSubscriptionPaymentReturn = {
	paymentMethods: PaymentMethod[] | undefined;
	isLoading: boolean;
	error: SubscriptionError | null;
	addPaymentMethod: UseMutationResult<PaymentMethodResponse, SubscriptionError, string>;
	removePaymentMethod: UseMutationResult<PaymentMethodResponse, SubscriptionError, string>;
	setDefaultPaymentMethod: UseMutationResult<PaymentMethodResponse, SubscriptionError, string>;
};

export function useSubscriptionPayment(): UseSubscriptionPaymentReturn {
	const queryClient = useQueryClient();

	const {
		data: paymentMethods,
		isLoading,
		error,
	} = useQuery<PaymentMethod[], SubscriptionError>({
		queryKey: ['payment-methods'],
		queryFn: async () => {
			const { data } = await axios.get('/api/payment-methods');

			return data.map((method: PaymentMethod) => ({
				id: method.id,
				brand: method.brand,
				last4: method.last4,
				isDefault: method.isDefault,
				expiryMonth: method.expiryMonth,
				expiryYear: method.expiryYear,
			}));
		},
	});

	const addPaymentMethod = useMutation<PaymentMethodResponse, SubscriptionError, string>({
		mutationFn: async (paymentMethodId: string) => {
			const response = await fetch('/api/payment-methods/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ paymentMethodId }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
		},
	});

	const removePaymentMethod = useMutation<PaymentMethodResponse, SubscriptionError, string>({
		mutationFn: async (paymentMethodId: string) => {
			const response = await fetch(`/api/payment-methods/${paymentMethodId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
		},
	});

	const setDefaultPaymentMethod = useMutation<PaymentMethodResponse, SubscriptionError, string>({
		mutationFn: async (paymentMethodId: string) => {
			const response = await fetch(`/api/payment-methods/${paymentMethodId}/default`, {
				method: 'PUT',
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
		},
	});

	return {
		paymentMethods,
		isLoading,
		error,
		addPaymentMethod,
		removePaymentMethod,
		setDefaultPaymentMethod,
	};
}
