'use client';

import { useParams } from 'next/navigation';

import { MessageForm } from '@/src/components/messages/MessageForm';
import { MessageList } from '@/src/components/messages/MessageList';
import { useProjectMessages } from '@/src/hooks';

export default function DeveloperProjectMessagesPage(): JSX.Element {
	const { projectId } = useParams();
	const { data, isLoading } = useProjectMessages(projectId as string);

	if (isLoading) {
		return <div className="container py-8">Loading messages...</div>;
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Project Messages</h1>
			<MessageList messages={data?.data} />
			<MessageForm projectId={projectId as string} />
		</div>
	);
}
