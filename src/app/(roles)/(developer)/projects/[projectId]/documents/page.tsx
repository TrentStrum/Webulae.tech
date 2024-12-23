'use client';

import { useParams } from 'next/navigation';

import DocumentCard from '@/src/components/documents/DocumentCard';
import DocumentUploader from '@/src/components/documents/DocumentUploader';
import { useProjectDocuments } from '@/src/hooks';

export default function DeveloperProjectDocumentsPage(): JSX.Element {
	const { projectId } = useParams();
	const { data, isLoading } = useProjectDocuments(projectId as string);

	if (isLoading) {
		return <div className="container py-8">Loading documents...</div>;
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Project Documents</h1>
			<DocumentCard document={data?.data} />
			<DocumentUploader projectId={projectId as string} />
		</div>
	);
}
