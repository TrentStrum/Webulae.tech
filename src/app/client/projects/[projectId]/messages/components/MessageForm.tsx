import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { useToast } from '@/src/hooks';
import { useSendMessage } from '@/src/hooks/react-query/useMessages';

import type { ProjectMember } from '@/src/types';




type Props = {
	members: ProjectMember[];
	projectId: string;
}

export default function MessageForm({ members, projectId }: Props) {
	const [recipient, setRecipient] = useState('');
	const [subject, setSubject] = useState('');
	const [content, setContent] = useState('');
	const { toast } = useToast();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutate: sendMessage, isPending: sending } = useSendMessage(queryClient);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();

		sendMessage(
			{ projectId, recipientId: recipient, subject, content },
			{
				onSuccess: () => {
					toast({ title: 'Success', description: 'Message sent successfully.' });
					setRecipient('');
					setSubject('');
					setContent('');
				},
				onError: () => {
					toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' });
				},
			},
		);
	};

	return (
		<form onSubmit={handleSend} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="recipient">To</Label>
				<Select value={recipient} onValueChange={setRecipient} required>
					<SelectTrigger>
						<SelectValue placeholder="Select recipient" />
					</SelectTrigger>
					<SelectContent>
						{members.map((member) => (
							<SelectItem key={member.userId} value={member.userId}>
								{member.profiles.full_name || member.profiles.username} ({member.role})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="subject">Subject</Label>
				<Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
			</div>
			<div className="space-y-2">
				<Label htmlFor="content">Message</Label>
				<Textarea
					id="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={6}
					required
				/>
			</div>
			<div className="flex justify-end gap-4">
				<Button type="button" variant="outline" onClick={() => router.back()} disabled={sending}>
					Cancel
				</Button>
				<Button type="submit" disabled={sending}>
					{sending ? 'Sending...' : 'Send Message'}
				</Button>
			</div>
		</form>
	);
}
