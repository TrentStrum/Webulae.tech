import { type UseMutationResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';
import { useToast } from '@/src/hooks/helpers/use-toast';
import { apiClient } from '@/src/lib/apiClient';
import { queryClient } from '@/src/lib/cache/queryCache';

import { useApiMutation } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Subscription, PaymentMethod } from '@/src/types/subscription.types';

export function useCreateSubscription(): UseMutationResult<
	ApiResponse<Subscription>,
	ApiError,
	{ planId: string; paymentMethodId: string }
> {
	const { toast } = useToast();
	
	return useApiMutation<Subscription, { planId: string; paymentMethodId: string }>(
		endpoints.subscription.create,
		{
			onSuccess: () => {
				toast({
					title: 'Success',
					description: 'Subscription created successfully',
				});
			},
			onError: (error) => {
				toast({
					title: 'Error',
					description: error.message,
					variant: 'destructive',
				});
			}
		}
	);
}

export function useUpdateSubscription(): UseMutationResult<
	ApiResponse<Subscription>,
	ApiError,
	{ subscriptionId: string; planId: string }
> {
	const { toast } = useToast();

	return useApiMutation<Subscription, { subscriptionId: string; planId: string }>(
		endpoints.subscription.base,
		{
			mutationFn: async ({ subscriptionId, planId }) => {
				const response = await apiClient.patch<ApiResponse<Subscription>>(
					endpoints.subscription.update(subscriptionId),
					{ planId }
				);
				return response.data;
			},
			onSuccess: () => {
				toast({
					title: 'Success',
					description: 'Subscription updated successfully',
				});
			},
			onError: (error) => {
				toast({
					title: 'Error',
					description: error.message,
					variant: 'destructive',
				});
			}
		}
	);
}

export function useCancelSubscription(): UseMutationResult<
	ApiResponse<Subscription>,
	ApiError,
	{ subscriptionId: string; atPeriodEnd?: boolean }
> {
	const { toast } = useToast();

	return useApiMutation<Subscription, { subscriptionId: string; atPeriodEnd?: boolean }>(
		endpoints.subscription.base,
		{
			mutationFn: async ({ subscriptionId, atPeriodEnd = true }) => {
				const response = await apiClient.post<ApiResponse<Subscription>>(
					endpoints.subscription.cancel(subscriptionId),
					{ atPeriodEnd }
				);
				return response.data;
			},
			onSuccess: () => {
				toast({
					title: 'Success',
					description: 'Subscription cancelled successfully',
				});
			},
			onError: (error) => {
				toast({
					title: 'Error',
					description: error.message,
					variant: 'destructive',
				});
			}
		}
	);
}

export function useAddPaymentMethod(): UseMutationResult<
	ApiResponse<PaymentMethod>,
	ApiError,
	string
> {
	return useApiMutation<PaymentMethod, string>(
		endpoints.subscription.paymentMethods,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.subscription.paymentMethods
				});
			}
		}
	);
}

export function useRemovePaymentMethod(): UseMutationResult<
	ApiResponse<void>,
	ApiError,
	string
> {
	return useApiMutation<void, string>(
		endpoints.subscription.paymentMethods,
		{
			mutationFn: async (paymentMethodId) => {
				const response = await apiClient.delete<ApiResponse<void>>(
					endpoints.subscription.paymentMethod(paymentMethodId)
				);
				return response.data;
			},
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.subscription.paymentMethods
				});
			}
		}
	);
} 