import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const route = new APIRouteBuilder()
  .get(async (req) => {
    const { orgId } = auth();
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Perform searches based on type
    const searches = [];

    if (type === 'all' || type === 'members') {
      searches.push(
        supabase
          .from('users')
          .select('id, email, profiles(display_name, avatar_url)')
          .eq('organization_id', orgId)
          .or(`email.ilike.%${query}%,profiles.display_name.ilike.%${query}%`)
          .limit(5)
      );
    }

    if (type === 'all' || type === 'projects') {
      searches.push(
        supabase
          .from('projects')
          .select('id, name, description')
          .eq('organization_id', orgId)
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(5)
      );
    }

    const results = await Promise.all(searches);
    const errors = results.filter(r => r.error);
    
    if (errors.length) {
      throw new APIError('Search failed', 500);
    }

    return APIResponse.success({
      members: results[0]?.data || [],
      projects: results[1]?.data || [],
    });
  });

export { route as GET }; 