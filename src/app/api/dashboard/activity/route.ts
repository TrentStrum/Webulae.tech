import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const route = new APIRouteBuilder()
  .get(async (req) => {
    const { orgId } = auth();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const searchParams = new URL(req.url).searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        users (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new APIError('Failed to fetch activity', 500);
    return APIResponse.success(data);
  });

export { route as GET }; 