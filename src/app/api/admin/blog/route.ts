import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/src/lib/supabase';

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const searchTerm = searchParams.get('searchTerm') || '';
		const sortBy = searchParams.get('sortBy') || 'newest';
		const offset = parseInt(searchParams.get('offset') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '10', 10);

		const supabase = getSupabaseClient();

		let query = supabase.from('blog_posts').select('*');

		// Search filter
		if (searchTerm) {
			query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
		}

		// Sorting
		switch (sortBy) {
			case 'oldest':
				query = query.order('published_at', { ascending: true });
				break;
			case 'a-z':
				query = query.order('title', { ascending: true });
				break;
			case 'z-a':
				query = query.order('title', { ascending: false });
				break;
			case 'newest':
			default:
				query = query.order('published_at', { ascending: false });
				break;
		}

		query = query.range(offset, offset + limit - 1);

		const { data, error } = await query;
		if (error) throw error;

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Error fetching blog posts:', error);
		return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
	}
}

