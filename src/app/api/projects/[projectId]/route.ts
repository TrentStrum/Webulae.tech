import { supabaseClient } from '@/src/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
	const projectId = params.projectId;

	try {
		const { data, error } = await supabaseClient
			.from('projects')
			.select('*')
			.eq('id', projectId)
			.single();

		if (error) throw new Error(error.message);

		return NextResponse.json(data, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
