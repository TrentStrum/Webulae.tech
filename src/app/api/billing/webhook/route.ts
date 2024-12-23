import { headers } from 'next/headers';
import Stripe from 'stripe';

import { APIRouteBuilder } from '@/src/lib/api/route-builder';
import { supabase } from '@/src/lib/supabase/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const route = new APIRouteBuilder()
  .post(async (req: Request) => {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              cancel_at: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000)
                : null,
            })
            .eq('stripe_subscription_id', subscription.id);
          break;
      }

      return new Response(null, { status: 200 });
    } catch (err) {
      console.error('Error processing webhook:', err);
      return new Response('Webhook Error', { status: 400 });
    }
  });

export { route as POST }; 