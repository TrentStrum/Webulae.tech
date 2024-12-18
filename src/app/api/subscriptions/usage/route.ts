import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

export async function GET(): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { data: subscription } = await supabase
			.from('subscriptions')
			.select(
				'projects_used, projects_limit, storage_used, storage_limit, api_calls_used, api_calls_limit'
			)
			.eq('user_id', session.user.id)
			.single();

		if (!subscription) {
			return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
		}

		return NextResponse.json({
			projects: {
				used: subscription.projects_used,
				total: subscription.projects_limit,
			},
			storage: {
				used: subscription.storage_used,
				total: subscription.storage_limit,
			},
			api: {
				used: subscription.api_calls_used,
				total: subscription.api_calls_limit,
			},
		});
	} catch (error) {
		console.error('Error fetching subscription usage:', error);
		return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 });
	}
}
