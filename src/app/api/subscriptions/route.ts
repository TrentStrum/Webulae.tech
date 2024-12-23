import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { z } from 'zod';

import { APIError } from '@/src/lib/api/error';
import { APIResponse } from '@/src/lib/api/response';
import { APIRouteBuilder } from '@/src/lib/api/route-builder';
import { supabase } from '@/src/lib/supabase/config';

import type { NextRequest } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const subscriptionSchema = z.object({
  priceId: z.string(),
  paymentMethodId: z.string(),
});

const route = new APIRouteBuilder()
  .post(async (req: NextRequest) => {
    const { priceId, paymentMethodId } = APIResponse.validate(
      subscriptionSchema,
      await req.json()
    );

    const { userId, orgId } = auth();
    if (!userId || !orgId) throw new APIError('Unauthorized', 401);

    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('org_id', orgId)
      .single();

    if (!customer?.stripe_customer_id) {
      throw new APIError('Customer not found', 404);
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.stripe_customer_id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
    });

    return APIResponse.success({ subscriptionId: subscription.id });
  });

export { route as POST }; 