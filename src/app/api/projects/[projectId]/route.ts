import { NextResponse } from 'next/server';

import { supabaseClient } from '@/src/lib/supabaseClient';

export async function GET(
	req: Request,
	{ params }: { params: { projectId: string } }
): Promise<Response> {
	const projectId = params.projectId;

	try {
		const { data, error } = await supabaseClient
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
