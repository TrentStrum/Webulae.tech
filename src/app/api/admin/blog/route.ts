import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

export async function GET(): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: posts, error } = await supabase
			.from('blog_posts')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching blog posts:', error);
			return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
		}

		return NextResponse.json(posts, { status: 200 });
	} catch (error) {
		console.error('Error fetching blog posts:', error);
		return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
	}
}

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const body = await req.json();
		const { title, content, published_at = new Date().toISOString() } = body;

		// Validate required fields
		if (!title || !content) {
			return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
		}

		const { data: newPost, error } = await supabase
			.from('blog_posts')
			.insert([{ title, content, published_at, author_id: 'some-author-id', slug: 'some-slug' }])
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json(newPost, { status: 201 });
	} catch (error) {
		console.error('Error creating blog post:', error);
		return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
	}
}
