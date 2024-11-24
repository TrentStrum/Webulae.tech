import { supabaseClient } from '@/src/lib/supabaseClient';

import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
	const projectId = params.projectId;

	try {
		const { data, error } = await supabaseClient
			.from('project_timeline')
			.select('*')
			.eq('project_id', projectId)
			.order('start_date', { ascending: true });

		if (error) throw new Error(error.message);

		return NextResponse.json(data, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
