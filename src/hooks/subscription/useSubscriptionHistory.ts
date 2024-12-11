'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/src/lib/apiClient';

import type { SubscriptionEvent, SubscriptionError } from '@/src/types/subscription.types';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

interface FetchEventsParams {
	subscriptionId: string;
	type?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
}

type UseSubscriptionHistoryReturn = UseInfiniteQueryResult<
	InfiniteData<SubscriptionEvent[], number>,
	SubscriptionError
>;

export function useSubscriptionHistory({
	subscriptionId,
	type,
	startDate,
	endDate,
}: Omit<FetchEventsParams, 'page'>): UseSubscriptionHistoryReturn {
	return useInfiniteQuery<
		SubscriptionEvent[],
		SubscriptionError,
		InfiniteData<SubscriptionEvent[], number>,
		(string | undefined)[],
		number
	>({
		queryKey: ['subscription-history', subscriptionId, type, startDate, endDate],
		queryFn: async ({ pageParam = 0 }) => {
			const data = await apiClient.get<SubscriptionEvent[]>('/api/subscriptions/history', {
				params: {
					subscriptionId,
					type,
					startDate,
					endDate,
					page: pageParam,
				},
			});
			return data;
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined,
	});
}
