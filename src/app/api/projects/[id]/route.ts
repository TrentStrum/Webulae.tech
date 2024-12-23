import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'deleted']),
});

const route = new APIRouteBuilder({
  requireAuth: true,
  permissions: ['projects:write'],
  cacheControl: 'no-cache',
})
  .get(async (req) => { 
    const id = req.nextUrl.pathname.split('/').pop();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new APIError('Failed to fetch project', 500);
    if (!data) throw new APIError('Project not found', 404);

    return APIResponse.success(data);
  })
  .patch(async (req) => {
    const id = req.nextUrl.pathname.split('/').pop();
    const data = APIResponse.validate(projectSchema, await req.json());
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: updated, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new APIError('Failed to update project', 500);
    return APIResponse.success(updated);
  });

export { route as GET, route as PATCH }; 