import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
	try {
		const supabase = createServerComponentClient({ cookies });
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const searchTerm = searchParams.get('searchTerm') || '';
		const sortBy = searchParams.get('sortBy') || 'newest';
		const limit = 10;

		console.log('API Route - Query params:', { page, searchTerm, sortBy });

		// First get all posts to handle categories properly
		const { data: posts, error } = await supabase
			.from('blog_posts')
			.select(
				`
        *,
        profiles (
          username,
          full_name
        )
      `
			)
			.order('created_at', { ascending: sortBy === 'oldest' });

		if (error) {
			console.error('Supabase error:', error);
			throw error;
		}

		// Filter by search term if provided
		let filteredPosts = posts;
		if (searchTerm) {
			filteredPosts = posts.filter(
				(post) =>
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
