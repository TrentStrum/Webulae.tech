import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
  dashboard: z.object({
    layout: z.enum(['grid', 'list']),
    defaultView: z.enum(['week', 'month', 'year']),
  }),
});

const route = new APIRouteBuilder()
  .get(async () => {
    const { userId } = auth();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new APIError('Failed to fetch preferences', 500);
    return APIResponse.success(data || {});
  })
  .put(async (req) => {
    const { userId } = auth();
    const data = APIResponse.validate(preferencesSchema, await req.json());
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: updated, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...data })
      .select()
      .single();

    if (error) throw new APIError('Failed to update preferences', 500);
    return APIResponse.success(updated);
  });

export { route as GET, route as PUT }; 