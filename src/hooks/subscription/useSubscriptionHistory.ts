'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { supabaseClient as supabase } from '../../lib/supabaseClient';

import type { SubscriptionEvent, SubscriptionError } from '@/src/types/subscription.types';
import type { Database } from '@/src/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
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
	const client = supabase as unknown as SupabaseClient<Database>;

	return useInfiniteQuery<
		SubscriptionEvent[],
		SubscriptionError,
		InfiniteData<SubscriptionEvent[], number>,
		(string | undefined)[],
		number
	>({
		queryKey: ['subscription-history', subscriptionId, type, startDate, endDate],
		queryFn: async ({ pageParam = 0 }) => {
			const { data, error } = await client
				.from('subscription_events')
				.select('*')
				.eq('subscription_id', subscriptionId)
				.order('created_at', { ascending: false })
				.range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

			if (error) throw { code: error.code, message: error.message };

			return (
				data?.map((event) => ({
					id: event.id,
					subscriptionId: event.subscription_id,
					type: event.type,
					data: event.data,
					createdAt: event.created_at,
				})) ?? []
			);
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined,
	});
}
