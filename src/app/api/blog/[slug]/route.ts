import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const blogPostSchema = z.object({
	title: z.string().min(1).max(200),
	content: z.string().min(1),
	published: z.boolean().optional(),
});

const route = new APIRouteBuilder({
	// Cache blog posts for 1 hour, allow serving stale content for 5 minutes while revalidating
	cache: {
		maxAge: 60 * 60,
		staleWhileRevalidate: 60 * 5,
	},
})
	.get(async (req) => {
		const slug = req.nextUrl.pathname.split('/').pop();
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);
		
		const { data, error } = await supabase
			.from('blog_posts')
			.select('*')
			.eq('slug', slug)
			.single();

		if (error) throw new APIError('Failed to fetch blog post', 500);
		if (!data) throw new APIError('Blog post not found', 404);

		return APIResponse.success(data);
	})
	.patch(async (req) => {
		const slug = req.nextUrl.pathname.split('/').pop();
		const data = APIResponse.validate(blogPostSchema, await req.json());
		
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);
		const { data: updated, error } = await supabase
			.from('blog_posts')
			.update(data)
			.eq('slug', slug)
			.select()
			.single();

		if (error) throw new APIError('Failed to update blog post', 500);
		return APIResponse.success(updated);
	}, {
		// No caching for mutations
		cache: undefined,
		// Keep rate limiting for mutations
		rateLimit: true,
	});

export { route as GET, route as PATCH };
