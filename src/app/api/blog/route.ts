import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const searchTerm = searchParams.get('searchTerm') || '';
		const sortBy = searchParams.get('sortBy') || 'newest';
		const limit = 10;

		console.log('API Route - Query params:', { page, searchTerm, sortBy });

		let query = supabase
			.from('blog_posts')
			.select(`
				*,
				profiles (
					username,
					full_name
				)
			`);

		// Apply search if provided
		if (searchTerm) {
			query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
		}

		// Apply sorting
		query = query.order('created_at', { ascending: sortBy === 'oldest' });

		// Get total count
		const { count } = await query.count();

		// Get paginated data
		const { data: posts, error } = await query
			.range((page - 1) * limit, page * limit - 1);

		if (error) throw error;

		// Structure the response
		const response = {
			data: {
				featured: posts?.[0],
				categories: posts?.slice(1).reduce((acc, post) => {
					const category = post.category || 'Uncategorized';
					if (!acc[category]) acc[category] = [];
					acc[category].push(post);
					return acc;
				}, {} as Record<string, typeof posts>),
			},
			pagination: {
				page,
				limit,
				total: count,
				hasMore: count > page * limit,
			},
		};

		console.log('API Response:', response);

		return NextResponse.json(response);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch blog posts' },
			{ status: 500 }
		);
	}
}
