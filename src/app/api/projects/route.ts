import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

import type { DataAccessInterface } from '@/src/contracts/DataAccess';
import type { Database } from '@/src/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

const projectDataAccess: DataAccessInterface<Project> = {
	async getByKey(key: string, value: string, single = true) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const query = supabase.from('projects').select('*').eq(key, value);

		if (single) {
			const { data, error } = await query.single();
			if (error) throw new Error(`Error fetching project by ${key}: ${error.message}`);
			return data;
		}

		const { data, error } = await query;
		if (error) throw new Error(`Error fetching projects by ${key}: ${error.message}`);
		return data;
	},

	async getAll() {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data, error } = await supabase.from('projects').select('*');
		if (error) throw new Error(`Error fetching all projects: ${error.message}`);
		return data;
	},

	async create(data: Partial<Project>) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: newProject, error } = await supabase
			.from('projects')
			.insert(data as Project)
			.single();
		if (error) throw new Error(`Error creating project: ${error.message}`);
		return newProject;
	},

	async update(id: string, data: Partial<Project>) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: updatedProject, error } = await supabase
			.from('projects')
			.update(data)
			.eq('id', id)
			.single();
		if (error) throw new Error(`Error updating project with ID ${id}: ${error.message}`);
		return updatedProject;
	},

	async delete(id: string) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { error } = await supabase.from('projects').delete().eq('id', id);
		if (error) throw new Error(`Error deleting project with ID ${id}: ${error.message}`);
	},
};

function isErrorWithMessage(error: unknown): error is { message: string } {
	return typeof error === 'object' && error !== null && 'message' in error;
}

// Handler for GET requests to fetch all projects or a specific project by ID
export async function GET(req: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (id) {
			const project = await projectDataAccess.getByKey?.('id', id);
			if (!project) {
				return NextResponse.json({ error: 'Project not found' }, { status: 404 });
			}
			return NextResponse.json(project, { status: 200 });
		}

		const projects = await projectDataAccess.getAll?.();
		return NextResponse.json(projects, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for POST requests to create a new project
export async function POST(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const newProject = await projectDataAccess.create?.(body);

		if (!newProject) {
			return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
		}

		return NextResponse.json(newProject, { status: 201 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for PUT requests to update an existing project
export async function PUT(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const { id, ...updates } = body;

		if (!id) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		const updatedProject = await projectDataAccess.update?.(id, updates);

		if (!updatedProject) {
			return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
		}

		return NextResponse.json(updatedProject, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for DELETE requests to delete a project
export async function DELETE(req: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		await projectDataAccess.delete?.(id);
		return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
