'use client';

import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import DocumentUploader from '@/src/components/documents/DocumentUploader';
import DocumentCard from '@/src/components/documents/DocumentCard';
import { useProjectDocuments } from '@/src/hooks/react-query/useDocuments';
import { useParams } from 'next/navigation';

export default function ProjectDocumentsPage() {
	const { projectId } = useParams();
	const { data: documents, isPending, isError, error } = useProjectDocuments(projectId as string);

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>{error?.message}</div>;

	if (!documents) return <div>No documents found</div>;

	return (
		<div className="container max-w-3xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Project Documents</CardTitle>
				</CardHeader>
				<DocumentUploader projectId={projectId as string} />

				<div className="space-y-4 mt-8">
					{documents?.map((document) => <DocumentCard key={document.id} document={document} />)}
				</div>
			</Card>
		</div>
	);
}
