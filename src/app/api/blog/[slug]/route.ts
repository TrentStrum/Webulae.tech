import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

import type { RouteContext } from '@/src/types/route.types';

export async function GET(
	_: Request,
	{ params }: RouteContext<{ slug: string }>
): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data, error } = await supabase
			.from('blog_posts')
			.select('*, profiles(*)')
			.eq('slug', params.slug)
			.single();

		if (error) throw error;
		if (!data) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
	}
}
