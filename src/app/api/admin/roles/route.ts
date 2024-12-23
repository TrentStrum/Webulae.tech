import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';


const roleUpdateSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'member', 'viewer']),
});

const route = new APIRouteBuilder()
  .get(async () => {
    const { orgId } = auth();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('organization_id', orgId);

    if (error) throw new APIError('Failed to fetch roles', 500);
    return APIResponse.success(data);
  })
  .post(async (req) => {
    const { userId, role } = APIResponse.validate(
      roleUpdateSchema,
      await req.json()
    );
    const { orgId } = auth();
    if (!orgId) throw new APIError('Organization ID is required', 400);

    // Update role in Clerk
    await clerkClient.organizations.updateOrganizationMembership({
      organizationId: orgId,
      userId,
      role,
    });

    return APIResponse.success({ updated: true });
  });

export { route as GET, route as POST }; 