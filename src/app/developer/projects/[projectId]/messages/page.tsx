'use client';

import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { useToast } from '@/src/hooks';
import { useSendMessage } from '@/src/hooks/react-query/useMessages';
import { useProjectMessages } from '@/src/hooks/react-query/useProjects/useProjectMesages';

export default function ProjectMessagesPage() {
	const { id: projectId } = useParams();
	const { toast } = useToast();
	const [recipient, setRecipient] = useState('');
	const [subject, setSubject] = useState('');
	const [content, setContent] = useState('');
	const { data: messages, isLoading, refetch } = useProjectMessages(projectId as string);
	const queryClient = useQueryClient();
	const { mutate: sendMessage, isPending: isSending } = useSendMessage(queryClient);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await sendMessage({ projectId: projectId as string, recipientId: recipient, subject, content });
			toast({
				title: 'Message Sent',
				description: 'Your message has been sent successfully.',
			});

			setRecipient('');
			setSubject('');
			setContent('');
			refetch();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to send message.',
				variant: 'destructive',
			});
		}
	};

	if (isLoading) {
		return <div className="container py-8">Loading...</div>;
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Project Messages</h1>

			<Card className="mb-8">
				<CardHeader>
					<CardTitle>New Message</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSendMessage} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="recipient">To</Label>
							<Input
								id="recipient"
								value={recipient}
								onChange={(e) => setRecipient(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subject">Subject</Label>
							<Input
								id="subject"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Message</Label>
							<Textarea
								id="content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								rows={5}
								required
							/>
						</div>

						<div className="flex justify-end gap-4">
							<Button type="submit" disabled={isSending}>
								{isSending ? 'Sending...' : 'Send Message'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<h2 className="text-2xl font-bold mb-4">Message History</h2>
			<div className="space-y-4">
				{messages?.map((message) => (
					<Card key={message.id}>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle>{message.subject}</CardTitle>
									<p className="text-sm text-muted-foreground">From: {message.profiles.username}</p>
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
		</div>
	);
}
