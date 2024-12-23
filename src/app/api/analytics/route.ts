import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const dateRangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  metric: z.enum(['users', 'sessions', 'pageviews']),
});

const route = new APIRouteBuilder({
  cache: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60, // 1 minute
  },
})
  .get(async (req) => {
    const { orgId } = auth();
    const searchParams = new URL(req.url).searchParams;
    const query = APIResponse.validate(dateRangeSchema, {
      start: searchParams.get('start'),
      end: searchParams.get('end'),
      metric: searchParams.get('metric'),
    });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('organization_id', orgId)
      .gte('created_at', query.start)
      .lte('created_at', query.end)
      .eq('metric', query.metric);

    if (error) throw new APIError('Failed to fetch analytics', 500);
    return APIResponse.success(data);
  });

export { route as GET }; 