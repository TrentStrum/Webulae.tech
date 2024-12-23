import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const route = new APIRouteBuilder()
  .get(async (req) => {
    const { orgId } = auth();
    const searchParams = new URL(req.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const query = supabase
      .from('users')
      .select(`
        *,
        profiles (
          display_name,
          avatar_url
        ),
        roles (
          name,
          permissions
        )
      `, { count: 'exact' })
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    // Add search if provided
    if (search) {
      query.or(`email.ilike.%${search}%,profiles.display_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new APIError('Failed to fetch members', 500);

    return APIResponse.success({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  });

export { route as GET }; 