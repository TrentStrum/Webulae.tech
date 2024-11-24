import { SupabaseProjectDataAccess } from '@/src/dataAccess/supabaseProjectDataAccess';
import { NextResponse } from 'next/server';


const supabaseProjectDataAccess = new SupabaseProjectDataAccess();

function isErrorWithMessage(error: unknown): error is { message: string } {
	return typeof error === 'object' && error !== null && 'message' in error;
}

export async function GET() {
	try {
		const projects = await supabaseProjectDataAccess.getAll();
		return NextResponse.json(projects, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const newProject = await supabaseProjectDataAccess.create(body);
		return NextResponse.json(newProject, { status: 201 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { id, ...updates } = body;
		if (!id) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}
		const updatedProject = await supabaseProjectDataAccess.update(id, updates);
		return NextResponse.json(updatedProject, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		if (!id) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}
		await supabaseProjectDataAccess.delete(id);
		return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
