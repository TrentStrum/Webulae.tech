import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url);
		const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
		const searchTerm = searchParams.get('search') || '';
		const sortBy = searchParams.get('sort') || 'newest';
		const limit = 10;

		const cookieStore = cookies();
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!,
			{
				cookies: cookieStore,
				auth: {
					persistSession: false,
					autoRefreshToken: false,
				},
			}
		);

		// Get all posts to handle categories properly
		const { data: posts, error } = await supabase
			.from('blog_posts')
			.select('*, profiles(username, full_name)')
			.order('created_at', { ascending: sortBy === 'oldest' });

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
		}

		// Filter by search term if provided
		let filteredPosts = posts || [];
		if (searchTerm) {
			filteredPosts = filteredPosts.filter(post =>
				post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.content?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Paginate the results
		const start = (page - 1) * limit;
		const end = start + limit;
		const paginatedPosts = filteredPosts.slice(start, end);

		const response = {
			data: {
				featured: paginatedPosts[0] || null,
				categories: paginatedPosts.slice(1).reduce(
					(acc, post) => {
						const category = post.category || 'Uncategorized';
						if (!acc[category]) acc[category] = [];
						acc[category].push(post);
						return acc;
					},
					{} as Record<string, typeof posts>
				),
			},
			pagination: {
				page,
				limit,
				total: filteredPosts.length,
				hasMore: end < filteredPosts.length,
			},
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
	}
}
