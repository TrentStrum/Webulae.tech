import { clerkClient , auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';


const organizationSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  settings: z.object({
    timezone: z.string(),
    locale: z.string(),
    features: z.record(z.boolean()),
  }).optional(),
});

const route = new APIRouteBuilder()
  .get(async () => {
    const { userId } = auth();
    if (!userId) throw new APIError('Unauthorized', 401);
    
    // Fetch organizations from Clerk
    const orgs = await clerkClient.users.getOrganizationMembershipList({
      userId,
    });

    return APIResponse.success(orgs);
  })
  .post(async (req) => {
    const data = APIResponse.validate(organizationSchema, await req.json());
    const { userId } = auth();

    // Create organization in Clerk
    const org = await clerkClient.organizations.createOrganization({
      name: data.name,
      slug: data.slug,
      createdBy: userId!,
    });

    // Store additional settings in Supabase
    if (data.settings) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase
        .from('organization_settings')
        .insert({
          organization_id: org.id,
          ...data.settings,
        });
    }

    return APIResponse.success(org, 201);
  });

export { route as GET, route as POST }; 