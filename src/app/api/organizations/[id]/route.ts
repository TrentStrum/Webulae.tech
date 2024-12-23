import { clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const organizationUpdateSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	slug: z
		.string()
		.min(1)
		.max(100)
		.regex(/^[a-z0-9-]+$/)
		.optional(),
	settings: z
		.object({
			timezone: z.string(),
			locale: z.string(),
			features: z.record(z.boolean()),
		})
		.optional(),
});

const route = new APIRouteBuilder()
	.get(async (req) => {
		const orgId = req.nextUrl.pathname.split('/').pop();
		if (!orgId) throw new APIError('Organization ID is required', 400);
		const [org, settings] = await Promise.all([
			// Get org details from Clerk
			clerkClient.organizations.getOrganization({ organizationId: orgId }),
			// Get additional settings from Supabase
			createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
			)
				.from('organization_settings')
				.select('*')
				.eq('organization_id', orgId)
				.single()
				.then(({ data }) => data),
		]);

		return APIResponse.success({ ...org, settings });
	})
	.patch(async (req) => {
		const orgId = req.nextUrl.pathname.split('/').pop();
		const data = APIResponse.validate(organizationUpdateSchema, await req.json());

		// Update org in Clerk if name/slug changed
		if (data.name || data.slug) {
			await clerkClient.organizations.updateOrganization(orgId!, {
				name: data.name,
				slug: data.slug,
			});
		}

		// Update settings in Supabase if provided
		if (data.settings) {
			const supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
			);
			await supabase.from('organization_settings').upsert({
				organization_id: orgId,
				...data.settings,
			});
		}

		return APIResponse.success({ updated: true });
	});

export { route as GET, route as PATCH };
