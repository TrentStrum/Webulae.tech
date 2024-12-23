import { type UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/src/config/api-endpoints';
import { queryKeys } from '@/src/config/query-keys';

import { useApiQuery } from '../base-queries';

import type { ApiResponse, ApiError } from '@/src/types/api.types';
import type { Subscription, SubscriptionEvent, PaymentMethod } from '@/src/types/subscription.types';

export function useSubscriptionByUserId(userId: string): UseQueryResult<ApiResponse<Subscription>, ApiError> {
	return useApiQuery<Subscription>(
		queryKeys.subscription.detail(userId),
		endpoints.subscription.detail(userId)
	);
}

export function useSubscriptionHistory(subscriptionId: string): UseQueryResult<ApiResponse<SubscriptionEvent[]>, ApiError> {
	return useApiQuery<SubscriptionEvent[]>(
		queryKeys.subscription.history(subscriptionId),
		endpoints.subscription.history(subscriptionId)
	);
}

export function usePaymentMethods(): UseQueryResult<ApiResponse<PaymentMethod[]>, ApiError> {
	return useApiQuery<PaymentMethod[]>(
		queryKeys.subscription.paymentMethods,
		endpoints.subscription.paymentMethods
	);
}

export function useCurrentSubscription(): UseQueryResult<ApiResponse<Subscription>, ApiError> {
	return useApiQuery<Subscription>(
		queryKeys.subscription.current,
		endpoints.subscription.current
	);
} 