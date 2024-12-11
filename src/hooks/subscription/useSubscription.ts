'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/src/hooks/helpers/use-toast';
import { apiClient } from '@/src/lib/apiClient';

import type { Subscription, SubscriptionError } from '@/src/types/subscription.types';
import type { UseMutationResult } from '@tanstack/react-query';

type SubscriptionResponse = {
	success: boolean;
	subscription: Subscription;
};

export function useSubscription(userId: string): {
	subscription: Subscription | undefined;
	isLoading: boolean;
	error: SubscriptionError | null;
	createSubscription: UseMutationResult<
		SubscriptionResponse,
		SubscriptionError,
		{ planId: string; paymentMethodId: string }
	>;
	cancelSubscription: UseMutationResult<SubscriptionResponse, SubscriptionError, boolean>;
	updateSubscription: UseMutationResult<
		SubscriptionResponse,
		SubscriptionError,
		{ planId: string }
	>;
} {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		data: subscription,
		isLoading,
		error,
	} = useQuery<Subscription, SubscriptionError>({
		queryKey: ['subscription', userId],
		queryFn: async () => {
			const data = await apiClient.get<Subscription>(`/api/subscriptions/${userId}`);
			return data;
		}
	});

	const createSubscription = useMutation<
		SubscriptionResponse,
		SubscriptionError,
		{ planId: string; paymentMethodId: string }
	>({
		mutationFn: async ({
			planId,
			paymentMethodId,
		}: {
			planId: string;
			paymentMethodId: string;
		}) => {
			const response = await fetch('/api/subscriptions/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ planId, paymentMethodId }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
			toast({
				title: 'Success',
				description: 'Subscription created successfully',
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

	const cancelSubscription = useMutation<SubscriptionResponse, SubscriptionError, boolean>({
		mutationFn: async (atPeriodEnd = true) => {
			if (!subscription?.stripeSubscriptionId) {
				throw new Error('No active subscription found');
			}

			const response = await fetch('/api/subscriptions/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					subscriptionId: subscription.stripeSubscriptionId,
					atPeriodEnd,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
			toast({
				title: 'Success',
				description: 'Subscription canceled successfully',
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

	const updateSubscription = useMutation<
		SubscriptionResponse,
		SubscriptionError,
		{ planId: string }
	>({
		mutationFn: async ({ planId }: { planId: string }) => {
			if (!subscription?.stripeSubscriptionId) {
				throw new Error('No active subscription found');
			}

			const response = await fetch('/api/subscriptions/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					subscriptionId: subscription.stripeSubscriptionId,
					planId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
			toast({
				title: 'Success',
				description: 'Subscription updated successfully',
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
		subscription,
		isLoading,
		error,
		createSubscription,
		cancelSubscription,
		updateSubscription,
	};
}
