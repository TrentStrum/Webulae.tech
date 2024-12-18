import { formatDistanceToNow } from 'date-fns';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

import type { Message } from '@/src/types';

type Props = {
	messages: Message[];
};

export default function MessageHistory({ messages }: Props) {
	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<Card key={message.id}>
					<CardHeader>
						<div className="flex justify-between items-start">
							<div>
								<CardTitle>{message.subject}</CardTitle>
								<p className="text-sm text-muted-foreground">
									From: {message.profiles.full_name || message.profiles.username}
								</p>
							</div>
							<Badge className={message.status === 'unread' ? 'bg-primary' : ''}>
								{message.status}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<p className="mb-4 whitespace-pre-wrap">{message.content}</p>
						<p className="text-sm text-muted-foreground">
							{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
