import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const profileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  preferences: z.record(z.unknown()).optional(),
});

const route = new APIRouteBuilder()
  .get(async () => {
    const { userId } = auth();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new APIError('Failed to fetch profile', 500);
    return APIResponse.success(data);
  })
  .patch(async (req) => {
    const { userId } = auth();
    const data = APIResponse.validate(profileSchema, await req.json());
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: updated, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new APIError('Failed to update profile', 500);
    return APIResponse.success(updated);
  });

export { route as GET, route as PATCH }; 