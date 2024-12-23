import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const route = new APIRouteBuilder().get(async () => {
	const { orgId } = auth();
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const [users, activeUsers, pendingInvites] = await Promise.all([
		// Total users count
		supabase.from('users').select('id', { count: 'exact' }).eq('organization_id', orgId),

		// Active users in last 30 days
		supabase
			.from('users')
			.select('id', { count: 'exact' })
			.eq('organization_id', orgId)
			.gt('last_active', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

		// Pending invites
		supabase
			.from('invitations')
			.select('id', { count: 'exact' })
			.eq('organization_id', orgId)
			.eq('status', 'pending'),
	]);

	return APIResponse.success({
		totalUsers: users.count,
		activeUsers: activeUsers.count,
		pendingInvites: pendingInvites.count,
	});
});

export { route as GET };
