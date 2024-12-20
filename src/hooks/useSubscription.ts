import { useOrganization } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/src/lib/supabase/config';

interface SubscriptionData {
	subscription_status: string;
	subscription_price_id: string;
	plan: string;
}

export function useSubscription(): {
	subscription: SubscriptionData | null;
	isLoading: boolean;
} {
	const { organization } = useOrganization();

	const { data: subscription, isLoading } = useQuery({
		queryKey: ['subscription', organization?.id],
		queryFn: async (): Promise<SubscriptionData | null> => {
			if (!organization?.id) return null;

			const { data, error } = await supabase
				.from('organizations')
				.select('subscription_status, subscription_price_id')
				.eq('clerk_org_id', organization.id)
				.single();

			if (error) throw error;
			return data;
		},
		enabled: !!organization?.id,
	});

	return {
		subscription: subscription ?? null,
		isLoading,
	};
}
