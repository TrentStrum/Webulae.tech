'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import { Label } from '@/src/components/ui/label';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/src/types/subscription.types';

interface PlanSelectorProps {
  plans: SubscriptionPlan[];
  selectedPlanId?: string;
  onPlanSelect: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export function PlanSelector({ plans, selectedPlanId, onPlanSelect, isLoading }: PlanSelectorProps) {
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={interval === 'month' ? 'default' : 'outline'}
          onClick={() => setInterval('month')}
        >
          Monthly
        </Button>
        <Button
          variant={interval === 'year' ? 'default' : 'outline'}
          onClick={() => setInterval('year')}
        >
          Yearly
          <span className="ml-2 text-xs bg-primary-foreground/10 px-2 py-1 rounded-full">
            Save 20%
          </span>
        </Button>
      </div>

      <RadioGroup
        defaultValue={selectedPlanId}
        onValueChange={(value) => {
          const plan = plans.find((p) => p.id === value);
          if (plan) onPlanSelect(plan);
        }}
      >
        <div className="grid gap-8 md:grid-cols-3">
          {plans
            .filter((plan) => plan.interval === interval)
            .map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  selectedPlanId === plan.id ? 'border-primary' : ''
                }`}
              >
                {plan.name === 'Pro' && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                    Popular
                  </span>
                )}
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{plan.name}</span>
                    <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                  </CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{interval}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    disabled={isLoading}
                    onClick={() => onPlanSelect(plan)}
                  >
                    {isLoading ? 'Loading...' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </RadioGroup>
    </div>
  );
}