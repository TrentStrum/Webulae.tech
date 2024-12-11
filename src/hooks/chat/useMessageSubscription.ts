'use client';

import { useEffect, useState } from 'react';

import { createClient } from '@/src/lib/supabase/client';

import type { Message } from '@/src/types/chat.types';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

export function useMessageSubscription(channelId: string): Message[] {
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const supabase = createClient();

		const subscription = supabase
			.channel(`room:${channelId}`)
			.on<Message>(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${channelId}` },
				(payload: RealtimePostgresInsertPayload<Message>) =>
					setMessages((current) => [...current, payload.new])
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	}, [channelId]);

	return messages;
}
