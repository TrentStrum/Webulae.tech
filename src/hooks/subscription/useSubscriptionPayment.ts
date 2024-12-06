'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/src/hooks/helpers/use-toast';

import type { PaymentMethod, SubscriptionError } from '@/src/types/subscription.types';

export function useSubscriptionPayment(userId: string) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		data: paymentMethods,
		isLoading,
		error,
	} = useQuery<PaymentMethod[], SubscriptionError>({
		queryKey: ['payment-methods', userId],
		queryFn: async () => {
			const response = await fetch('/api/payment-methods');
			if (!response.ok) {
				const error = await response.json();
				throw error;
			}
			return response.json();
		},
	});

	const addPaymentMethod = useMutation({
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
			queryClient.invalidateQueries({ queryKey: ['payment-methods', userId] });
			toast({
				title: 'Success',
				description: 'Payment method added successfully',
			});
		},
		onError: (error: SubscriptionError) => {
			toast({
				title: 'Error',
				description: error.message,
				variant: 'destructive',
			});
		},
	});

	const removePaymentMethod = useMutation({
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
			queryClient.invalidateQueries({ queryKey: ['payment-methods', userId] });
			toast({
				title: 'Success',
				description: 'Payment method removed successfully',
			});
		},
		onError: (error: SubscriptionError) => {
			toast({
				title: 'Error',
				description: error.message,
				variant: 'destructive',
			});
		},
	});

	const setDefaultPaymentMethod = useMutation({
		mutationFn: async (paymentMethodId: string) => {
			const response = await fetch('/api/payment-methods/default', {
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
			queryClient.invalidateQueries({ queryKey: ['payment-methods', userId] });
			toast({
				title: 'Success',
				description: 'Default payment method updated successfully',
			});
		},
		onError: (error: SubscriptionError) => {
			toast({
				title: 'Error',
				description: error.message,
				variant: 'destructive',
			});
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
