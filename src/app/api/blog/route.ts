import { NextResponse } from 'next/server';

import { supabase } from '@/src/lib/supabase/server';

import type { DataAccessInterface } from '@/src/contracts/DataAccess';
import type { Database } from '@/src/types/database.types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

const blogDataAccess: DataAccessInterface<BlogPost> = {
	async getByKey(key: string, value: string, single = true) {
		const query = supabase
			.from('blog_posts')
			.select(
				`
				*,
				author:author_id (
					username,
					full_name
				)
			`
			)
			.eq(key, value);

		if (single) {
			const { data, error } = await query.single();
			if (error) throw new Error(error.message);
			return data;
		}

		const { data, error } = await query;
		if (error) throw new Error(error.message);
		return data;
	},

	async getAll() {
		const { data, error } = await supabase.from('blog_posts').select('*');
		if (error) throw new Error(error.message);
		return data;
	},

	async create(data: Partial<BlogPost>) {
		const { data: newPost, error } = await supabase
			.from('blog_posts')
			.insert(data as BlogPost)
			.single();
		if (error) throw new Error(error.message);
		return newPost;
	},

	async update(id: string, data: Partial<BlogPost>) {
		const { data: updatedPost, error } = await supabase
			.from('blog_posts')
			.update(data)
			.eq('id', id)
			.single();
		if (error) throw new Error(error.message);
		return updatedPost;
	},

	async delete(id: string) {
		const { error } = await supabase.from('blog_posts').delete().eq('id', id);
		if (error) throw new Error(error.message);
	},
};

function isErrorWithMessage(error: unknown): error is { message: string } {
	return typeof error === 'object' && error !== null && 'message' in error;
}

// Handler for GET requests to fetch all blog posts or a single blog post by any key (defaulting to ID)
export async function GET(req: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (id) {
			const post = await blogDataAccess.getByKey?.('id', id);
			if (!post) {
				return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
			}
			return NextResponse.json(post, { status: 200 });
		}

		const posts = await blogDataAccess.getAll?.();
		return NextResponse.json(posts, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for POST requests to create a new blog post
export async function POST(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const { title, content, author } = body;

		if (!title || !content || !author) {
			return NextResponse.json(
				{ error: 'Title, content, and author are required' },
				{ status: 400 }
			);
		}

		const slug = title
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '');
		const newPost = await blogDataAccess.create?.({ title, content, author_id: author, slug });
		return NextResponse.json(newPost, { status: 201 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for PUT requests to update an existing blog post
export async function PUT(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const { id, title, content } = body;

		if (!id || !title || !content) {
			return NextResponse.json({ error: 'ID, title, and content are required' }, { status: 400 });
		}

		const updatedPost = await blogDataAccess.update?.(id, { title, content });
		return NextResponse.json(updatedPost, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for DELETE requests to delete a blog post
export async function DELETE(req: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'ID is required' }, { status: 400 });
		}

		await blogDataAccess.delete?.(id);
		return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
