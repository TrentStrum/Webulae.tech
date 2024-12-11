import { NextResponse } from 'next/server';

import { createServerClient } from '@/src/lib/supabase/server';

export async function GET(
	req: Request,
	{ params }: { params: { projectId: string } }
): Promise<Response> {
	const projectId = params.projectId;

	try {
		const supabase = createServerClient();
		if (!supabase) throw new Error('Could not initialize Supabase client');

		const { data, error } = await supabase
			.from('projects')
			.select('*')
			.eq('id', projectId)
			.single();

		if (error) throw new Error(error.message);

		return NextResponse.json(data, { status: 200 });
	} catch (error: Error | unknown) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
