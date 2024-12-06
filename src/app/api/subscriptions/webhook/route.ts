```typescript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/src/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse('Webhook signature verification failed', { status: 400 });
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeletion(deletedSubscription);
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        await handleFailedPayment(invoice);
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new NextResponse('Webhook error', { status: 500 });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const subscriptionId = subscription.id;

  const { data: customer } = await supabase
    .from('customers')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!customer) {
    throw new Error('Customer not found');
  }

  await supabase.from('subscriptions').upsert({
    id: subscriptionId,
    user_id: customer.user_id,
    status,
    stripe_subscription_id: subscriptionId,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  });

  await supabase.from('subscription_events').insert({
    subscription_id: subscriptionId,
    type: subscription.status === 'active' ? 'created' : 'updated',
    data: {
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);

  await supabase.from('subscription_events').insert({
    subscription_id: subscription.id,
    type: 'canceled',
    data: {
      canceled_at: new Date().toISOString(),
    },
  });
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  await supabase.from('subscription_events').insert({
    subscription_id: subscriptionId,
    type: 'payment_failed',
    data: {
      invoice_id: invoice.id,
      amount_due: invoice.amount_due,
      next_payment_attempt: invoice.next_payment_attempt,
    },
  });
}
```;
