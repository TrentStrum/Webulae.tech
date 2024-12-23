import { formatDistanceToNow } from 'date-fns';

import type { Message } from '@/src/types';

interface MessageListProps {
	messages: Message[] | undefined;
}

export function MessageList({ messages }: MessageListProps): JSX.Element {
	if (!messages) return <div />;

	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<div key={message.id} className="border rounded-lg p-4">
					<div className="flex justify-between items-start mb-2">
						<h3 className="font-semibold">{message.sender.full_name}</h3>
						<span className="text-sm text-muted-foreground">
							{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
						</span>
					</div>
					<p className="text-sm">{message.content}</p>
				</div>
			))}
		</div>
	);
} 