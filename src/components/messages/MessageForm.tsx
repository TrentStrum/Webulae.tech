import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { useCreateMessage } from '@/src/hooks';

import type { ProjectMember } from '@/src/types';

interface MessageFormProps {
	projectId: string;
	members?: ProjectMember[];
}

export function MessageForm({ projectId }: MessageFormProps): JSX.Element {
	const [message, setMessage] = useState('');
	const { mutate: sendMessage, isPending } = useCreateMessage();

	const handleSubmit = (e: React.FormEvent): void => {
		e.preventDefault();
		if (!message.trim()) return;

		sendMessage(
			{ projectId, content: message },
			{
				onSuccess: () => {
					setMessage('');
				},
			}
		);
	};

	return (
		<form onSubmit={handleSubmit} className="mt-6">
			<Textarea
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type your message..."
				className="mb-4"
			/>
			<Button type="submit" disabled={isPending}>
				Send Message
			</Button>
		</form>
	);
} 