export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due' | 'pending';

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
};

export type Subscription = {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionEvent = {
  id: string;
  subscriptionId: string;
  type: 'created' | 'renewed' | 'canceled' | 'updated' | 'payment_failed';
  data: Record<string, any>;
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
};

export type SubscriptionError = {
  code: string;
  message: string;
  details?: Record<string, any>;
};