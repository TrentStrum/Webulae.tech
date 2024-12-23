import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const userUpdateSchema = z.object({
	role: z.enum(['admin', 'member', 'viewer']),
	status: z.enum(['active', 'suspended']).optional(),
	metadata: z.record(z.unknown()).optional(),
});

const route = new APIRouteBuilder({
	cache: {
		maxAge: 60, // 1 minute
		staleWhileRevalidate: 30,
	},
})
	.get(async () => {
		const { orgId } = auth();
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);
		
		const { data, error } = await supabase
			.from('users')
			.select('*, profiles(*)')
			.eq('organization_id', orgId);

		if (error) throw new APIError('Failed to fetch users', 500);
		return APIResponse.success(data);
	})
	.patch(async (req) => {
		const body = await req.json();
		const validated = userUpdateSchema.parse(body);
		
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);
		
		const { data, error } = await supabase
			.from('users')
			.update(validated)
			.eq('id', body.id)
			.single();

		if (error) throw new APIError('Failed to update user', 500);
		return APIResponse.success(data);
	});

export { route as GET, route as PATCH };
