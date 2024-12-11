import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

export async function GET(): Promise<NextResponse> {
	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: projects, error } = await supabase.from('projects').select('*');

		if (error) {
			throw new Error(`Error fetching projects: ${error.message}`);
		}

		return NextResponse.json(projects, { status: 200 });
	} catch (error) {
		console.error('GET /api/admin/projects error:', error);
		return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
	}
}

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');
		const { data: newProject, error } = await supabase.from('projects').insert(body).single();

		if (error) {
			throw new Error(`Error creating project: ${error.message}`);
		}

		return NextResponse.json(newProject, { status: 201 });
	} catch (error) {
		console.error('POST /api/admin/projects error:', error);
		return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
	}
}

export async function PUT(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const { id, ...updates } = body;

		if (!id) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: updatedProject, error } = await supabase
			.from('projects')
			.update(updates)
			.eq('id', id)
			.single();

		if (error) {
			throw new Error(`Error updating project with ID ${id}: ${error.message}`);
		}

		return NextResponse.json(updatedProject, { status: 200 });
	} catch (error) {
		console.error('PUT /api/admin/projects error:', error);
		return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
	}
}

export async function DELETE(req: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { error } = await supabase.from('projects').delete().eq('id', id);

		if (error) {
			throw new Error(`Error deleting project with ID ${id}: ${error.message}`);
		}

		return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('DELETE /api/admin/projects error:', error);
		return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
	}
}
