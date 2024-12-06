import { NextResponse } from 'next/server';

import { getSupabaseClient } from '@/src/lib/supabase';

export async function GET(req: Request, { params }: { params: { id: string } }) {
	try {
		const supabase = getSupabaseClient();
		const { id } = params;

		// Fetch the blog post by ID
		const { data: blogPost, error } = await supabase
			.from('blog_posts')
			.select('*')
			.eq('id', id)
			.single();

		if (error) {
			console.error('Error fetching blog post:', error);
			return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 404 });
		}

		return NextResponse.json(blogPost, { status: 200 });
	} catch (error) {
		console.error('Unexpected error fetching blog post:', error);
		return NextResponse.json(
			{ error: 'An unexpected error occurred while fetching the blog post' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	try {
		const supabase = getSupabaseClient();
		const { id } = params;
		const body = await req.json();

		// Validate required fields
		if (!body.title || !body.content) {
			return NextResponse.json(
				{ error: 'Title and content are required to update the blog post' },
				{ status: 400 }
			);
		}

		// Update the blog post
		const { error } = await supabase
			.from('blog_posts')
			.update({
				title: body.title,
				content: body.content,
				excerpt: body.excerpt || null,
				updated_at: new Date().toISOString(),
			})
			.eq('id', id);

		if (error) {
			console.error('Error updating blog post:', error);
			return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
		}

		return NextResponse.json({ message: 'Blog post updated successfully' }, { status: 200 });
	} catch (error) {
		console.error('Unexpected error updating blog post:', error);
		return NextResponse.json(
			{ error: 'An unexpected error occurred while updating the blog post' },
			{ status: 500 }
		);
	}
}
