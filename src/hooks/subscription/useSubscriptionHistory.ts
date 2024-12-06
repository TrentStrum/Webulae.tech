'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { supabase } from '@/src/lib/supabase';

import type { SubscriptionEvent, SubscriptionError } from '@/src/types/subscription.types';

const ITEMS_PER_PAGE = 10;

interface FetchEventsParams {
	subscriptionId: string;
	type?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
}

export function useSubscriptionHistory({
	subscriptionId,
	type,
	startDate,
	endDate,
}: Omit<FetchEventsParams, 'page'>) {
	return useInfiniteQuery<SubscriptionEvent[], SubscriptionError>({
		queryKey: ['subscription-history', subscriptionId, type, startDate, endDate],
		queryFn: async ({ pageParam = 0 }) => {
			let query = supabase
				.from('subscription_events')
				.select('*')
				.eq('subscription_id', subscriptionId)
				.order('created_at', { ascending: false })
				.range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

			if (type) {
				query = query.eq('type', type);
			}

			if (startDate) {
				query = query.gte('created_at', startDate);
			}

			if (endDate) {
				query = query.lte('created_at', endDate);
			}

			const { data, error } = await query;

			if (error) throw { code: error.code, message: error.message };
			return data || [];
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined;
		},
		initialPageParam: 0,
	});
}
