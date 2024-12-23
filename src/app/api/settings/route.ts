import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }).optional(),
  display: z.object({
    density: z.enum(['compact', 'comfortable', 'spacious']),
    sidebar: z.boolean(),
  }).optional(),
});

const route = new APIRouteBuilder()
  .get(async () => {
    const { orgId } = auth();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('organization_settings')
      .select('*')
      .eq('organization_id', orgId)
      .single();

    if (error) throw new APIError('Failed to fetch settings', 500);
    return APIResponse.success(data);
  })
  .patch(async (req) => {
    const { orgId } = auth();
    const data = APIResponse.validate(settingsSchema, await req.json());
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: updated, error } = await supabase
      .from('organization_settings')
      .update(data)
      .eq('organization_id', orgId)
      .select()
      .single();

    if (error) throw new APIError('Failed to update settings', 500);
    return APIResponse.success(updated);
  });

export { route as GET, route as PATCH }; 