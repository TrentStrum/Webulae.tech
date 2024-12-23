import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const route = new APIRouteBuilder()
  .post(async (req: Request) => {
    const { orgId } = auth();
    const { returnUrl } = await req.json();

    const { data: subscription } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ) 
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', orgId)
      .single();

    if (!subscription?.stripe_customer_id) {
      throw new APIError('No subscription found', 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: returnUrl,
    });

    return APIResponse.success({ url: session.url });
  });

export { route as POST }; 