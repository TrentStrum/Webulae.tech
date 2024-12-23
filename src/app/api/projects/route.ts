import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const projectSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	status: z.enum(['active', 'archived', 'deleted']),
	settings: z.record(z.unknown()).optional(),
});
	
const route = new APIRouteBuilder()
	.get(async () => {
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);
		const { data, error } = await supabase
			.from('projects')
			.select('*');

		if (error) throw new APIError('Failed to fetch projects', 500);
		return APIResponse.success(data);
	})
	.post(async (req) => {
		const data = APIResponse.validate(projectSchema, await req.json());
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);
		
		const { data: project, error } = await supabase
			.from('projects')
			.insert(data)
			.select()
			.single();

		if (error) throw new APIError('Failed to create project', 500);
		return APIResponse.success(project, 201);
	});

export { route as GET, route as POST };
