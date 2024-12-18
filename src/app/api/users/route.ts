import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

import type { DataAccessInterface } from '@/src/contracts/DataAccess';
import type { Database } from '@/src/types/database.types';

type User = Database['public']['Tables']['profiles']['Row'];

const userDataAccess: DataAccessInterface<User> = {
	async getByKey(key: string, value: string, single = true) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const query = supabase.from('profiles').select('*').eq(key, value);

		if (single) {
			const { data, error } = await query.single();
			if (error) throw new Error(`Error fetching user by ${key}: ${error.message}`);
			return data;
		}

		const { data, error } = await query;
		if (error) throw new Error(`Error fetching users by ${key}: ${error.message}`);
		return data;
	},

	async getAll() {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data, error } = await supabase.from('profiles').select('*');
		if (error) throw new Error(`Error fetching all users: ${error.message}`);
		return data;
	},

	async create(data: Partial<User>) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: newUser, error } = await supabase
			.from('profiles')
			.insert(data as User)
			.single();
		if (error) throw new Error(`Error creating user: ${error.message}`);
		return newUser;
	},

	async update(id: string, data: Partial<User>) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data: updatedUser, error } = await supabase
			.from('profiles')
			.update(data)
			.eq('id', id)
			.single();
		if (error) throw new Error(`Error updating user with ID ${id}: ${error.message}`);
		return updatedUser;
	},

	async delete(id: string) {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { error } = await supabase.from('profiles').delete().eq('id', id);
		if (error) throw new Error(`Error deleting user with ID ${id}: ${error.message}`);
	},
};

function isErrorWithMessage(error: unknown): error is { message: string } {
	return typeof error === 'object' && error !== null && 'message' in error;
}

// Handler for GET requests to fetch all users or a specific user by ID
export async function GET(req: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (id) {
			const user = await userDataAccess.getByKey?.('id', id);
			if (!user) {
				return NextResponse.json({ error: 'User not found' }, { status: 404 });
			}
			return NextResponse.json(user, { status: 200 });
		}

		const users = await userDataAccess.getAll?.();
		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for POST requests to create a new user
export async function POST(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const newUser = await userDataAccess.create?.(body);

		if (!newUser) {
			return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
		}

		return NextResponse.json(newUser, { status: 201 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for PUT requests to update an existing user
export async function PUT(req: Request): Promise<NextResponse> {
	try {
		const body = await req.json();
		const { id, ...updates } = body;

		if (!id) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}

		const updatedUser = await userDataAccess.update?.(id, updates);

		if (!updatedUser) {
			return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
		}

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}

// Handler for DELETE requests to delete a user
export async function DELETE(req: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}

		await userDataAccess.delete?.(id);
		return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
