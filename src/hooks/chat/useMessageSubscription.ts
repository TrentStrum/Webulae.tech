'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/src/lib/supabase/client';

export function useMessageSubscription(channelId: string) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`room:${channelId}`)
      .on('INSERT', (payload) => {
        setMessages(current => [...current, payload.new]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [channelId]);

  return messages;
} 