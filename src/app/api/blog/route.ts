import { NextResponse } from 'next/server';

import { supabase } from '@/src/lib/supabase/server';

export async function GET(request: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const searchTerm = searchParams.get('searchTerm') || '';
		const sortBy = searchParams.get('sortBy') || 'newest';
		const limit = 20;
		const from = (page - 1) * limit;
		const to = from + limit - 1;

		let query = supabase
			.from('blog_posts')
			.select(`
				id,
				title,
				content,
				author_id,
				slug,
				created_at,
				updated_at,
				published_at,
				excerpt,
				short_description,
				category,
				author:profiles(id, username, full_name)
			`, { count: 'exact' });

		if (searchTerm) {
			query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
		}

		const { count } = await query;

		const { data: posts, error } = await query
			.order('created_at', { ascending: sortBy === 'oldest' })
			.range(from, to);

		if (error) {
			console.error('Database query error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({
			posts,
			pagination: {
				page,
				limit,
				total: count || 0,
				hasMore: count ? from + posts.length < count : false,
			},
		});

	} catch (error) {
		console.error('Unexpected error in blog API:', error);
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
