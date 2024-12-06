'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/src/hooks/helpers/use-toast';
import { supabase } from '@/src/lib/supabase';

import type { Subscription, SubscriptionError } from '@/src/types/subscription.types';

export function useSubscription(userId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery<Subscription, SubscriptionError>({
    queryKey: ['subscription', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw { code: error.code, message: error.message };
      return data;
    },
  });

  const createSubscription = useMutation({
    mutationFn: async ({ planId, paymentMethodId }: { planId: string; paymentMethodId: string }) => {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, paymentMethodId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
      toast({
        title: 'Success',
        description: 'Subscription created successfully',
      });
    },
    onError: (error: SubscriptionError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async (atPeriodEnd: boolean = true) => {
      if (!subscription?.stripeSubscriptionId) {
        throw new Error('No active subscription found');
      }

      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripeSubscriptionId,
          atPeriodEnd,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
      toast({
        title: 'Success',
        description: 'Subscription canceled successfully',
      });
    },
    onError: (error: SubscriptionError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateSubscription = useMutation({
    mutationFn: async ({ planId }: { planId: string }) => {
      if (!subscription?.stripeSubscriptionId) {
        throw new Error('No active subscription found');
      }

      const response = await fetch('/api/subscriptions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripeSubscriptionId,
          planId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
      toast({
        title: 'Success',
        description: 'Subscription updated successfully',
      });
    },
    onError: (error: SubscriptionError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    subscription,
    isLoading,
    error,
    createSubscription,
    cancelSubscription,
    updateSubscription,
  };
}