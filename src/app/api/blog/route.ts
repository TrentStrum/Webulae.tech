import { supabaseClient } from '@/src/lib/supabaseClient';
import { NextResponse } from 'next/server';


function isErrorWithMessage(error: unknown): error is { message: string } {
	return typeof error === 'object' && error !== null && 'message' in error;
}

// Handler for GET requests to fetch all blog posts
export async function GET() {
	try {
		const { data: posts, error } = await supabaseClient.from('blog_posts').select('*');

		if (error) throw new Error(error.message);

		return NextResponse.json(posts, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for POST requests to create a new blog post
export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { title, content, author } = body;

		if (!title || !content || !author) {
			return NextResponse.json(
				{ error: 'Title, content, and author are required' },
				{ status: 400 },
			);
		}

		// Generate a slug from the title
		const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

		const { data: newPost, error } = await supabaseClient
			.from('blog_posts')
			.insert({ title, content, author_id: author, slug })
			.single();

		if (error) throw new Error(error.message);

		return NextResponse.json(newPost, { status: 201 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for PUT requests to update an existing blog post
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { id, title, content } = body;

		if (!id || !title || !content) {
			return NextResponse.json({ error: 'ID, title, and content are required' }, { status: 400 });
		}

		const { data: updatedPost, error } = await supabaseClient
			.from('blog_posts')
			.update({ title, content })
			.eq('id', id)
			.single();

		if (error) throw new Error(error.message);

		return NextResponse.json(updatedPost, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for DELETE requests to delete a blog post
export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'ID is required' }, { status: 400 });
		}

		const { error } = await supabaseClient.from('blog_posts').delete().eq('id', id);

		if (error) throw new Error(error.message);

		return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
