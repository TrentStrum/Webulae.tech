import { NextResponse } from 'next/server';

export class APIError extends Error {
	constructor(
		message: string,
		public status: number = 500,
		public code?: string
	) {
		super(message);
	}
}

export const handleAPIError = (error: unknown): NextResponse => {
	console.error('API Error:', error);

	if (error instanceof APIError) {
		return NextResponse.json({ error: error.message }, { status: error.status });
	}

	return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
};
