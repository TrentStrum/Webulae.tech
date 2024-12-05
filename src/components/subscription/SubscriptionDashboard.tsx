```typescript
'use client';

import { useSubscription } from '@/src/hooks/subscription/useSubscription';
import { useSubscriptionHistory } from '@/src/hooks/subscription/useSubscriptionHistory';
import { useSubscriptionPayment } from '@/src/hooks/subscription/useSubscriptionPayment';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { CreditCard, History, Settings } from 'lucide-react';
import { PaymentMethodList } from './PaymentMethodList';
import { SubscriptionHistoryList } from './SubscriptionHistoryList';
import { UsageStats } from './UsageStats';
import { LoadingSpinner } from '../ui/loading-spinner';

interface Props {
  userId: string;
}

export function SubscriptionDashboard({ userId }: Props) {
  const { subscription, isLoading: isLoadingSubscription } = useSubscription(userId);
  const { paymentMethods, isLoading: isLoadingPayments } = useSubscriptionPayment(userId);
  const { data: history, isLoading: isLoadingHistory } = useSubscriptionHistory({
    subscriptionId: subscription?.id || '',
  });

  if (isLoadingSubscription || isLoadingPayments || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Dashboard</h1>

      <div className="grid gap-6">
        {/* Current Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">{subscription?.planId}</p>
                <p className="text-sm text-muted-foreground">
                  Renews {subscription?.currentPeriodEnd && 
                    formatDistanceToNow(new Date(subscription.currentPeriodEnd), { addSuffix: true })}
                </p>
              </div>
              <Badge variant={subscription?.status === 'active' ? 'default' : 'destructive'}>
                {subscription?.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <UsageStats type="Projects" used={5} limit={10} />
          <UsageStats type="Storage" used={2.5} limit={5} />
          <UsageStats type="API Calls" used={8000} limit={10000} />
        </div>

        {/* Subscription Management Tabs */}
        <Tabs defaultValue="payment-methods">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payment-methods">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodList paymentMethods={paymentMethods || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Subscription History</CardTitle>
              </CardHeader>
              <CardContent>
                <SubscriptionHistoryList events={history?.pages.flat() || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Auto-renew Subscription</p>
                    <p className="text-sm text-muted-foreground">
                      Your subscription will automatically renew at the end of the billing period
                    </p>
                  </div>
                  <Button variant={subscription?.cancelAtPeriodEnd ? 'outline' : 'default'}>
                    {subscription?.cancelAtPeriodEnd ? 'Enable Auto-renew' : 'Cancel Auto-renew'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```