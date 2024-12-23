import { auth , clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

import type { OrganizationMembership } from '@clerk/nextjs/server';

const userUpdateSchema = z.object({
  role: z.enum(['admin', 'member', 'viewer']),
  status: z.enum(['active', 'suspended']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const route = new APIRouteBuilder()
  .get(async (req) => {
    const userId = req.nextUrl.pathname.split('/').pop();
    const { orgId } = auth();
    
    const members = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId!,
    });
    
    const member = members.find((m: OrganizationMembership) => 
      m.publicUserData?.userId === userId
    );

    if (!member) throw new APIError('User not found', 404);
    return APIResponse.success(member);
  })
  .patch(async (req) => {
    const userId = req.nextUrl.pathname.split('/').pop();
    const { orgId } = auth();
    if (!orgId) throw new APIError('Organization ID is required', 400);
    const data = APIResponse.validate(userUpdateSchema, await req.json());

    const updated = await clerkClient.organizations.updateOrganizationMembership({
      organizationId: orgId,
      userId: userId!,
      role: data.role,
    });

    // Update additional metadata in Supabase if needed
    if (data.metadata) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase
        .from('user_metadata')
        .upsert({
          user_id: userId,
          organization_id: orgId,
          ...data.metadata,
        });
    }

    return APIResponse.success(updated);
  })
  .delete(async (req) => {
    const userId = req.nextUrl.pathname.split('/').pop();
    const { orgId } = auth();

    await clerkClient.organizations.deleteOrganizationMembership({
      organizationId: orgId!,
      userId: userId!,
    });

    return APIResponse.success({ deleted: true });
  });

export { route as GET, route as PATCH, route as DELETE }; 