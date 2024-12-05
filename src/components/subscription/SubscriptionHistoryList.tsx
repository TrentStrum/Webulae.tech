'use client';

import { SubscriptionEvent } from '@/src/types/subscription.types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/src/components/ui/badge';

interface Props {
  events: SubscriptionEvent[];
}

export function SubscriptionHistoryList({ events }: Props) {
  const getEventColor = (type: SubscriptionEvent['type']) => {
    switch (type) {
      case 'created':
        return 'bg-green-500/10 text-green-500';
      case 'renewed':
        return 'bg-blue-500/10 text-blue-500';
      case 'canceled':
        return 'bg-red-500/10 text-red-500';
      case 'updated':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'payment_failed':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <div className="flex items-center space-x-2">
              <Badge className={getEventColor(event.type)}>
                {event.type.replace('_', ' ')}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
              </p>
            </div>
            {event.data.message && (
              <p className="mt-2 text-sm">{event.data.message}</p>
            )}
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No subscription events found.
        </p>
      )}
    </div>
  );
}