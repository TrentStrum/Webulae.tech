import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const billingSchema = z.object({
  priceId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const route = new APIRouteBuilder()
  .get(async () => {
    const { orgId } = auth();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Fetch current subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*)')
      .eq('organization_id', orgId)
      .single();

    if (error) throw new APIError('Failed to fetch subscription', 500);

    // Fetch upcoming invoice if there's an active subscription
    let upcomingInvoice = null;
    if (subscription?.stripe_subscription_id) {
      upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        subscription: subscription.stripe_subscription_id,
      });
    }

    return APIResponse.success({
      subscription,
      upcomingInvoice,
    });
  })
  .post(async (req) => {
    const { priceId, successUrl, cancelUrl } = APIResponse.validate(
      billingSchema,
      await req.json()
    );
    const { orgId } = auth();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: orgId || undefined,
    } as Stripe.Checkout.SessionCreateParams);

    return APIResponse.success({ url: session.url });
  });

export { route as GET, route as POST }; 